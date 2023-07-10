<template>
    <ion-modal :is-open="isOpen">
    <ion-content>
    <div class="body_all">
        <div @click="click_on(post?.media)" class="my_img" :style="{
            'background-image': `url(${post?.media.get_url})`,
            'background-position': 'top center',
            'background-size': 'cover',
        }">
            <div class="wrapper">
                <button class="play_b" v-if="post?.media.is_vid">
                    <ion-icon slot="start" :icon="play"></ion-icon>
                </button>
                <div class="title_t">
                    {{ post?.get_title }}
                </div>
                
            </div>
            <button @click.stop="close_()" class="close_b">
                    <ion-icon slot="start" :icon="close"></ion-icon>
                </button>
                <button @click.stop="downloadMedia(post)" class="download_b">
                    <ion-icon v-if="!downloading" slot="start" :icon="download"></ion-icon>
                    <ion-spinner v-else name="crescent"></ion-spinner>
                </button>
        </div>
        <div class="corps">
            
            <div class="d_sp">
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Texte à ajouter</ion-label>
                    </ion-list-header>
                    <div style="padding-left: 1rem; padding-right: 1rem;">
                        <div> Copiez le texte suivant afin de l'ajouter au statut posté. </div>
                    </div>
                    <div style="padding-left: 0.6rem; padding-right: 0.6rem;" >
                        <div class="editable-div" contenteditable>
                          {{post?.get_complete}}
                        </div>
                    </div>
                </ion-list>

            </div>
            <div v-if="slug == 'proposed'" class="d_sp">
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Poster maintenant</ion-label>
                    </ion-list-header>
                    <div style="padding-left: 0.8rem; padding-right: 0.8rem;">
                        <div> Combien de vues pensez-vous pouvoir obtenir? </div>
                        <form @submit.prevent="accepted_post()">
                            <div style="margin-top: -0.3rem; ">
                                <ion-input required label="Entrez un nombre" :readonly="slug != 'proposed' || validated"
                                    label-placement="floating" fill="outline" helper-text="Le nombre doit etre au moins 10"
                                    placeholder="nombre de vues..." @ionInput="e => goal = e.target.value" ></ion-input>
                            </div>
                            <div v-if="slug == 'proposed' && !validated" style="padding-bottom: 0.7rem; padding-top: 0.6rem;">
                                <ion-button type="submit" mode="ios" color="primary" expand="full" shape="round">J'accepte
                                    de poster</ion-button>
                            </div>
                            <div v-else style="padding-bottom: 0.8rem; padding-top: 0.6rem;" >
                                <ion-checkbox labelPlacement="end" checked >Post accepté</ion-checkbox>
                            </div>
                        </form>
                    </div>
                </ion-list>
            </div>
            <!---
            <div class="d_sp">
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Telecharger {{ post?.media.is_vid ? "la video" : "l'image" }}</ion-label>
                    </ion-list-header>
                    <div style="padding-bottom: 0.7rem;">
                        <ion-button @click="(() => {
                            if (post?.value.media.is_vid) ur = post?.value.media.vid_url;
                            else ur = post?.value.media.get_url;
                            downloadFile(ur, 'pub' + post?.id + '__' + post?.get_title);
                        })()" expand="full" shape="round">Cliquez ici</ion-button>
                    </div>
                </ion-list>
            </div>
            --->
            <div class="d_sp" v-if="slug != 'proposed'">
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Resultat obtenu</ion-label>
                    </ion-list-header>
                    <div>
                        <div style="padding-left: 1rem; padding-right: 1rem;"> Veuillez soumettre la capture d'ecran du
                            statut avec le nombre de vues </div>
                        <div style="padding-top: 0.3rem; padding-bottom: 0.2rem;" >
                            <ion-item>
                                <ion-thumbnail slot="start">
                                    <img :src="preuve != '' ? preuve : '../../img/img_no.jpg'" />
                                </ion-thumbnail>
                                <ion-label> {{ preuve != '' ? "Une image soumise" : "Aucune image soumise" }} </ion-label>
                                <ion-button @click="handle_upload()" slot="end">
                                    <ion-icon :icon="preuve != '' ? eye : cloudUpload" slot="end"></ion-icon>
                                    {{ preuve != '' ? "Voir" : "Soumettre" }}
                                </ion-button>
                            </ion-item>
                        </div>
                        <div style="padding-bottom: 0.6rem;" >
                            <ion-item>
                                <ion-input :readonly="status != '' && status != 'Resultat rejeté'" :value="vue_nb" @ionInput="e => vue_nb = e.target.value"
                                    label="Nombre" id="getResV" placeholder="nombre de vues obtenu...."></ion-input>
                            </ion-item>
                        </div>
                    </div>
                </ion-list>
            </div>
            <div class="d_sp" v-if="slug != 'proposed'" >
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Mon Paiement</ion-label>
                    </ion-list-header>
                    <div style="padding-left: 1rem; padding-right: 1rem;">
                        <div> {{ status != "" ? ( status == "Resultat validé" ? "Vous avez déjà reçu le paiement pour ce post. Verifiez votre compte " : "Suivez l'etat de validation de votre paiement ici.") : "Envoyer vos resultats afin de recevoir votre gain" }} </div>
                        <div v-if="status != ''" class="stat_">
                            <div class="show_p" :style="{
                                'background-color' : get_color
                            }">

                            </div>
                            <div class="stat_text">
                                {{ status }}
                            </div>
                        </div>
                        <div v-if="error" class="error">
                            {{ error }}
                        </div>
                        <div v-if="status == '' || status == 'Resultat rejeté'" style="padding-bottom: 0.7rem; padding-top: 0.3rem;">
                            <ion-button @click="sent_result()" mode="ios" color="secondary" expand="full"
                                shape="round">Envoyer mon resultat</ion-button>
                        </div>
                    </div>

                </ion-list>

            </div>
        </div>
        <div v-show="false">
            <input id="preuve" type="file" accept="image/*" @change="e => upload_preuve(e)" />
        </div>
        <div v-show="false">
            <photo-provider v-if="preuve != ''">
                <photo-consumer :intro="'Images'" :src="preuve">
                    <img :src="preuve" :id="'preuve:img'" style="width: 40vw:" class="view-box" />
                </photo-consumer>
            </photo-provider>
        </div>
    </div>
    </ion-content>
    </ion-modal>
</template>

<style scoped >
.download_b{
    position: fixed;
    top: 10px;
    right: 0.6rem;
    bottom: 8px;
    width: 40px;
    height: 40px;
    border-radius: 15px;
    font-size: 1.5rem;
    padding-top: 0.2rem;
    background: #5e17eb;
    color: white;
}

.editable-div {
  width: 100%;
  min-height: 50px;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #ccc;
  outline: none;
  margin-top: 0.6rem;
  margin-bottom: 0.9rem;
  background-color: #f2f2f2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}



.error {
    margin-top: -0.4rem;
    padding: 0.8rem;
    border-radius: 15px;
    color: rgb(174, 32, 3);
    background: rgba(174, 31, 3, 0.268);
}

.stat_text {
    font-size: 1.1rem;
    font-weight: 600;
    padding: 1rem 0.6rem;
}

.show_p {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    border-radius: 100%;
    margin-right: 0.1rem;
}

.stat_ {
    display: flex;
    align-items: center;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
}

.d_sp {
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
}

.corps {
    padding: 0.5rem;
}

.close_b {
    position: fixed;
    top: 10px;
    left: 0.6rem;
    bottom: 8px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    font-size: 1.8rem;
    padding-top: 0.2rem;
    background: #5e17eb;
    color: white;

}

.play_b {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    border-radius: 100%;
    font-size: 40px;
    margin-left: -32px;
    margin-top: -32px;
    padding-left: 0.1rem;
    background: #5e17eb;
    color: white;
}

.title_t {
    position: absolute;
    right: 0.9rem;
    bottom: 0.6rem;
    font-size: 1.5rem;
    font-weight: bolder;
    color: rgb(80,80,80);
}

.wrapper {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top,#ffd63400, transparent);
    position: relative;
}

.my_img {
    width: 100%;
    height: 360px;
}

.body_all {
    width: 100vw;
    min-height: 100vh;
    background: rgb(234, 227, 240);
}

ion-content {
    --background: rgb(234, 227, 240);
  }
</style>

<script lang="ts" >
import { access_tok, showLoading, show_alert } from "@/global/utils";
import { IonList, IonListHeader, IonLabel, IonItem, IonTextarea, IonInput, IonButton, IonCheckbox } from "@ionic/vue"
import axios from "axios";
import { close, play, eye, download, cloudUpload } from "ionicons/icons";
import { computed, defineComponent, defineEmits, ref, toRef, watch } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    props: {
        isOpen: Boolean,
        post: Object,
        slug: String
    },
    components: { IonList, IonListHeader, IonLabel, IonItem, IonTextarea, IonButton, IonInput, IonCheckbox },
    setup(props, ctx) {
        const emits = defineEmits(['close', 'see']);
        const click_on = (media: any) => {
            ctx.emit('see', media);
        }
        const post = toRef(props, 'post');
        const open = toRef(props, 'isOpen');
        watch(open, (newo, oldo) => {
            if(newo) set_utils();
            })
        const close_ = () => {
            ctx.emit('close')
        }

        const preuve = ref("")
        const status = ref("")
        const error = ref("")
        const ur = ref("")

        const validated = ref(false)
        const goal = ref()
        const router = useRouter()

        const accepted_post = async () => {
            if (!post.value) return
            const load = await showLoading("Ajout...");
            const resp = await axios.post('api/post_post/', {
                post: post.value?.id,
                goal: goal.value
            }, {
                headers: {
                    Authorization: `Bearer ${await access_tok(router, load)}`
                }
            })
            if(!resp.data['done']){
                load.dismiss()
                return show_alert('', resp.data['reason'])
            }
            if (resp.data['done']) validated.value = true;
            load.dismiss()
            downloadFile(post.value.media.is_vid ? post.value.media.vid_url : post.value.media.get_url, "pub" + post.value.id + "__" + post.value.get_title);
        }

        const downloading = ref(false);

        const get_blob = (url: string, destination : string) => {
            downloading.value = true;
          fetch(url)
            .then((res) => {
              return res.blob();
            })
            .then((blob) => {
              const data_uri = URL.createObjectURL(blob);
              setTimeout(function () {
              downlooad_file(data_uri, destination);
            }, 400);
            });
        };

        const downlooad_file = (blob: string, destination : string) => {
          const a = document.createElement("a");
          a.href = blob;
          a.target = "_blank";
          // Use a.download if available, it prevents plugins from opening.
          if ("download" in a) {
            a.setAttribute("download", destination);
          }
          // Add a to the doc for click to work.
          (document.body || document.documentElement).appendChild(a);
          if (a.click) {
            a.click(); 
          }
          a.parentNode?.removeChild(a);
          downloading.value = false;
          show_alert("Téléchargement enclenché", `${post.value?.media.is_vid ? "La vidéo" : "L'image"} a été téléchargée avec succès. Vous pouvez la poster maintenant.`);
        };

        const downloadFile = async (url: string, destination: string) => {
          get_blob(url, destination);
        };

        const downloadMedia = (post : any) => {
            let ur = post.media.get_url;
            if(post.media.is_vid) ur = post.media.vid_url;
            downloadFile(ur, "pub" + post.id + "__" + post.get_title)

        }

        const set_utils = async () => {

            const resp = await axios.post('api/get_preuve/', {
                post: post.value?.id
            }, {
                headers: {
                    Authorization: `Bearer ${await access_tok(router, undefined)}`
                }
            })
            if (resp.data['done']) {
                preuve.value = resp.data['result'];
                status.value = resp.data['status'];
                error.value = resp.data['errors'];
                if (resp.data['vue_nb']) vue_nb.value = resp.data['vue_nb']
            }
        }

        const handle_upload = () => {

            if (preuve.value != '') return document.getElementById('preuve:img')?.click();
            document.getElementById('preuve')?.click()

        }

        const upload_preuve = async (e: any) => {
            if (!post.value) return;
            const load = await showLoading("Envoi...")
            const file = e.target.files[0];
            const form = new FormData();
            form.append("preuve", file);
            form.append('post', post.value.id);
            const resp = await axios.post('api/upload_preuve/', form, {
                headers: {
                    Authorization: `Bearer ${await access_tok(router, undefined)}`
                }
            })
            if (resp.data['done']) preuve.value = resp.data['result'];
            load.dismiss()
        }

        const click_img = (id: string) => document.getElementById(id)?.click();
        const vue_nb = ref();

        const get_color = computed(() => {
            if (status.value == "") return "#0e0e0e";
            else if (status.value == "En cours de traitement") return "#d9d7d2";
            else if (status.value == "Resultat validé") return "#34c300";
            else if (status.value == "Resultat rejeté") return "#c31400";
        })

        const sent_result = async () => {
            if(preuve.value == "") return show_alert("Impossible de continuer", "Vous devez soumettre la capture d'ecran de votre statut avec le nombre de vues.");
            if(!vue_nb.value) {
                const inputElm = document.getElementById("getResV") as HTMLIonInputElement;
                return inputElm?.setFocus();
            

        }
            const load = await showLoading("Envoi...")
            const resp = await axios.post("api/set_checked/", {
                nb_vues : vue_nb.value,
                post : post.value?.id
            }, {
                headers: {
                    Authorization: `Bearer ${await access_tok(router, undefined)}`
                }
            })

            if(resp.data['done']){
                await set_utils()
            }
            load.dismiss()
        }

        const al = (a : any) => {
            alert(a)
        }

        return {
            click_on,
            close_,
            close,
            play,
            validated,
            goal,
            accepted_post,
            downloadFile,
            ur,
            preuve,
            status,
            error,
            eye,
            cloudUpload,
            click_img,
            handle_upload,
            upload_preuve,
            vue_nb,
            get_color,
            sent_result,
            download,
            al,
            downloadMedia,
            downloading
        }
    }
})
</script>