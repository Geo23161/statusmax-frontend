<template>
  <ion-page>
    <ion-header mode="ios" >
      <ion-toolbar>
        <ion-title> <div style="display : flex; align-items: center; justify-content: center; margin-left: -0.5rem;" > <img style="height: 1.7rem; margin-right: 0.5rem; border-radius: 7px;" :src="'../../resources/icon.png'" /> <div > StatusMax </div> </div> </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="body_all" >
        <div v-for="h in homeObj" :key="h.slug" class="d_sp" >
          <ion-list :inset="true" mode="ios">
          <ion-list-header>
            <ion-label>{{h.name}}</ion-label>
          </ion-list-header>

          <div style="padding-left: 1rem; padding-right: 1rem;" >
            <div > {{h.desc}} </div>
            <div style="padding-top: 0.9rem; " >
              <div >
                <div v-if="h.medias.length" class="photos">
                  <div
                    v-for="img in h.medias"
                    :key="img.id"
                    @click="img.is_vid ? (vOpen = true, cUrl = img.vid_url) :click_img(img.id)"
                    :style="{
                      'background-size': 'cover',
                      'background-position': 'top center',
                      'background-image': `url('${img.get_url}')`,
                    }"
                    class="photo"
                  >
                    <button class="play_b" v-if="img.is_vid" >
                      <ion-icon slot="start" :icon="play"></ion-icon>
                    </button>
                  </div>
                </div>
                <div class="no_photos" v-else >
                  <div style="display: flex; justify-content: space-around; padding: 0.8rem;" >
                    <img :src="'../../img/no_data.svg'" style="width: 60%;" />
                  </div>
                </div>
              </div>
              <div style="padding-top: 0.6rem;" >
              <ion-item  >
                <ion-label>
                  <div style="display: flex; justify-content: space-between" >
                    <div >Valeur</div>
                    <div class="money" >{{h.value}} F</div>
                  </div>
                </ion-label>
                <ion-icon slot="start" :icon="diamond"></ion-icon>
              </ion-item>
              </div>
            </div> 
            <div style="padding-bottom: 0.7rem;" >
              <ion-button @click="router.push('/home/' + h.slug)"  mode="ios" color="primary" expand="full" shape="round"
                >Voir tout</ion-button
              >
            </div>
          </div>

          </ion-list>
        </div>
      </div>
      <div v-show="false">
        <photo-provider>
          <photo-consumer
            v-for="img in all_imgs"
            :key="img.id"
            :intro="'Images'"
            :src="img.get_url"
          >
            <img
              :src="img.get_url"
              :id="img.id + ':img'"
              style="width: 40vw:"
              class="view-box"
            />
          </photo-consumer>
        </photo-provider>
      </div>
      <vid-player :isOpen="vOpen" :urlP="cUrl" @close="vOpen = false" />
    </ion-content>
  </ion-page>
</template>

<style scoped >

.play_b{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  font-size: 1.6rem;
  margin-left: -20px;
  margin-top: -20px;
  padding-left: 0.1rem;
  background: #5e17eb;
  color: white;

}

.photo:hover {
  width: 140px;
  height: 150px;
  min-width: 120px;
}

.photo {
  margin-right: 0.7rem;
  width: 120px;
  min-width: 120px;
  height: 120px;
  border-radius: 15px;
  transition: all 0.5s ease-in-out;
  position: relative;
}

.photos {
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: scroll;
}

.money{
  font-weight: bolder
}

.d_sp {
  margin-top: 0rem;
  margin-bottom: 0rem;
}

.body_all {
  width: 100vw;
  min-height: 100%;
  background: white;
  padding-left: 0rem;
  padding-right: 0rem;
  padding-top: 0.5rem;
  padding-bottom: 2rem;
  background: rgb(234, 227, 240);
  font-family: 'PT Serif', serif;
}
</style>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonInput,
  IonButton,
  IonMenu,
  IonMenuToggle,
  IonList,
  onIonViewDidEnter,
  IonSpinner,
  alertController,
  loadingController,
  IonAvatar,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonIcon
} from "@ionic/vue";
import { arrowBack, location, arrowForward, aperture, diamond, play } from "ionicons/icons";
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { show_alert, showLoading, access_tok } from "@/global/utils";
import axios from "axios"
import VidPlayer from "../components/VidPlayer.vue";

const click_img = (id: string) => {
  document.getElementById(id+ ':img')?.click();
};

const cUrl = ref("")
const vOpen = ref(false)
const router = useRouter()

const all_imgs = computed(() => {
  let imgs = [] as any[];
  for(const hom of homeObj.value){
    imgs = imgs.concat(hom.medias.filter((e : any) => !e.is_vid));

  }
  return imgs

})
/*
const imgs = [
  {
    id : 1,
    get_url : "../../img/tab1.png",
  },
  {
    id : 2,
    get_url : "../../img/tab2.png",
    is_vid : true,
    vid_url : "../../img/vid.mp4",
  },
  {
    id : 3,
    get_url : "../../img/tab3.png"
  },
  {
    id : 4,
    get_url : "../../img/tab4.png"
  },
  {
    id : 5,
    get_url : "../../img/tab5.png"
  }
]**/

const is_first = ref(true);
const homeObj = ref<any[]>([]);

const get_home = async () => {
  const load = is_first.value ?(await showLoading("Patienter...")) : undefined;
  const resp = await axios.get("api/get_home/", {
      headers : {
        Authorization : `Bearer ${await access_tok(router, load)}`
      }
  });
  if(load) load.dismiss()
  homeObj.value = resp.data['result'];
  is_first.value = false
}

onIonViewDidEnter(() => {
  get_home()
})

</script>
