<template>
    <ion-modal mode="ios" :is-open="isOpen">
        <ion-header>
            <ion-toolbar>
                <ion-title>Mobile Money</ion-title>
                <ion-buttons v-if="canBack" slot="start">
                    <ion-button @click="close()">Fermer</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="body_all">
                <div class="header">
                    Ajoutez un compte mobile money
                </div>
                <div class="body_i">
                    <img :src="'../../img/momo.svg'" class="img_b" />
                </div>
                <div style="text-align: center; padding-top: 0.6rem; padding-bottom: 0.6rem">
                    Avant de continuer, vous devez ajouter un compte momo
                </div>
                <form class="inputs" @submit.prevent="add_momo()">
                    <div>
                        <div style="display: flex; align-items: center;">
                            <div style="margin-right: 0.6rem;">
                                <ion-item fill="outline" mode="md" color="primary">
                                    <ion-select required @ionChange="country = $event.detail.value" aria-label="Votre pays"
                                        interface="popover" placeholder="Pays">
                                        <ion-select-option value="BJ">Benin</ion-select-option>
                                        <ion-select-option value="TG">Togo</ion-select-option>
                                        <ion-select-option value="CI">Côte d'Ivoire</ion-select-option>
                                    </ion-select>
                                </ion-item>
                            </div>
                            <div style="flex-grow: 1;">
                                <ion-item fill="outline" mode="md" color="primary">
                                    <ion-input required type="number" placeholder="Numéro momo"
                                        @ionInput="(e) => (number = e.target.value as string)"></ion-input>
                                </ion-item>
                            </div>
                        </div>
                        <div class="d_sp">
                            <ion-item fill="outline" mode="md" color="primary">
                                <ion-input required type="text" placeholder="Nom enregistré"
                                    @ionInput="(e) => (name = e.target.value as string)"></ion-input>
                            </ion-item>

                        </div>
                        <div>
                            <ion-button type="submit" shape="round" color="primary" expand="full">Verifier</ion-button>
                        </div>
                    </div>
                </form>
            </div>
        </ion-content>
    </ion-modal>
</template>

<style scoped >
.inputs {
    padding-top: 1.8rem;
}

.myinput {
    width: 90vw;
    padding-top: 0.9rem;
    padding-bottom: 0.9rem;
}

.myinp:hover {
    border-color: #f28241;
    color: #f28241;
    background: rgb(245, 245, 245);
}

.d_sp {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.img_b {
    width: 90%;
    padding: 1rem;
}

.body_i {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 0.4rem;
}

.header {
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
}

.status {
    padding-left: 0rem !important;
    padding-right: 0rem !important;
}

.body_all {
    width: 100vw;
    min-height: 100%;
    background: white;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    background: rgb(234, 227, 240);
    font-family: 'PT Serif', serif;
}

ion-content {
    --background: rgb(234, 227, 240);
  }
</style>
  
<script lang="ts" >
import { defineComponent, defineProps, ref, defineEmits, watch } from "vue";
import {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonModal,
    IonIcon,
    IonAvatar,
    IonCheckbox,
    IonSearchbar,
    IonToolbar,
    IonTitle,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons
} from "@ionic/vue";
import { location } from "ionicons/icons";
import axios from "axios";
import { access_tok, showLoading } from '@/global/utils';
import { useRouter } from "vue-router";

export default defineComponent({
    props: {
        isOpen: Boolean,
        canBack: Boolean
    },
    components: {
        IonModal,
        IonItem,
        IonToolbar,
        IonTitle,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonInput,
        IonButton,
        IonButtons

    },
    setup(prop, { emit }) {
        const emits = defineEmits(["close", "done"]);
        const close = () => {
            emit("close");
        };
        const done = (momo: any) => {
            emit("done", momo);
        };
        const country = ref("")
        const number = ref("")
        const name = ref("")
        const router = useRouter();


        const add_momo = async () => {
            const load = await showLoading('Ajout...')
            const resp = await axios.post("api/add_momo/", {
                country: country.value,
                number: number.value,
                name: name.value
            }, {
                headers: {
                    Authorization: `Bearer ${await access_tok(router, load)}`
                }
            })
            if (resp.data['done']) {
                done(resp.data['result'])
            }
            load.dismiss();
        }

        return {
            close,
            done,
            country,
            number,
            name,
            add_momo
        };
    },
});
</script>