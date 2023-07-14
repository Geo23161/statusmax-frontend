<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="paramObj" class="body_all">
        <div class="list first">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>Compte Whatsapp</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-icon :icon="paramObj['actif'] ? radioButtonOn : radioButtonOff" :style="{color: paramObj['actif'] ? '#5e17eb' : 'red' }" slot="start" />
              <ion-label>{{ paramObj['actif'] ? 'Actif' : 'Bloqué'}}</ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="phonePortrait" slot="start" />
              <ion-label>Numero {{paramObj['whatsapp']}}</ion-label>
            </ion-item>
            <ion-item @click="router.push('/create/?only_for=whatsapp')" button>
              <ion-icon :icon="swapHorizontal" slot="start" />
              <ion-label>Changer de compte</ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div class="list first">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>Audiences et ciblage</ion-label>
            </ion-list-header>
            <ion-item @click="router.push('/create?only_for=detail')" button>
              <ion-icon :icon="information" slot="start" />
              <ion-label>Details de l'audience</ion-label>
            </ion-item>
            <ion-item @click="router.push('/create?only_for=interest')" button>
              <ion-icon :icon="bonfire" slot="start" />
              <ion-label>Centre d'Interêts</ion-label>
            </ion-item>
            <ion-item @click="router.push('/create?only_for=profession')" button>
              <ion-icon :icon="ribbon" slot="start" />
              <ion-label>Professions</ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div class="list first">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>Compte Momo</ion-label>
              <ion-button @click="mOpen = true" >Changer</ion-button>
            </ion-list-header>
            <ion-item >
              <ion-icon :icon="person" slot="start" />
              <ion-label>{{ paramObj['momo']['name'] }}</ion-label>
            </ion-item>
            <ion-item >
              <ion-icon :icon="call" slot="start" />
              <ion-label>Numero {{ paramObj['momo']['number'] }}</ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div class="list first">
          <ion-list mode="ios">
            <ion-list-header>
              <ion-label>A propos</ion-label>
            </ion-list-header>
            <ion-item @click="open_norm_lnk('https://wa.me/' + paramObj['admin'])" button>
              <ion-icon :icon="megaphone" slot="start" />
              <ion-label>Ecrivez-nous ici</ion-label>
            </ion-item>
            <ion-item @click="open_norm_lnk(paramObj['privacy'])" button>
              <ion-icon :icon="handLeftOutline" slot="start" />
              <ion-label>Politique de confidentialité</ion-label>
            </ion-item>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <div style="font-weight: bolder"> StatusMax v1.0 </div>
                <div style="padding-top: 0.3rem">
                  L'application ainsi que le logo sont des marques déposées par ELife Global.
                </div>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
      <div class="body_all" v-else >
        <div class="global_spinner">
          <div>
            <ion-spinner color="primary" name="circles"></ion-spinner>
          </div>
        </div>
      </div>
      <add-momo :is-open="mOpen" :can-back="true" @close="mOpen = false"
        @done="momo => (paramObj['momo'] = momo, mOpen = false)" />
    </ion-content>
  </ion-page>
</template>

<style scoped >
.global_spinner {
  padding-top: 40vh;
  display: flex;
  justify-content: space-around;
}

.list {
  width: 100%;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}

.d_sp {
  margin-top: 0rem;
  margin-bottom: 1rem;
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
import AddMomo from '@/components/AddMomo.vue';
import { access_tok } from '@/global/utils';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonButton, onIonViewDidEnter, IonSpinner } from '@ionic/vue';
import axios from 'axios';
import { aperture, bonfire, call, handLeftOutline, information, megaphone, person, phonePortrait, radioButtonOn, ribbon, swapHorizontal, wallet, radioButtonOff } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const paramObj = ref()
const mOpen = ref(false)
const router = useRouter()
const get_params = async () => {
  const resp = await axios.get("api/get_params/", {
    headers : {
      Authorization : `Bearer ${await access_tok(router, undefined)}`
    }
  })
  if(resp.data['done']) paramObj.value = resp.data['result']
}

const open_norm_lnk = (lnk: string) => {
  window.location.href = lnk;
};

onIonViewDidEnter(() => {
  get_params()
})

</script>
