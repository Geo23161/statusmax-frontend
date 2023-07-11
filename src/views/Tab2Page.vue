<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-title>
          <div style="display : flex; align-items: center; justify-content: center; margin-left: -0.5rem;"> <img
              style="height: 1.7rem; margin-right: 0.5rem; border-radius: 7px;" :src="'../../resources/icon.png'" />
            <div> StatusMax </div>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="payObj" class="body_all">
        <div class="ban">
          <div class="myico yellow_bg">
            <ion-icon :icon="cash" />
          </div>
          <div class="ban_cont">
            <div class="title_b">Solde total</div>
            <div class="contentb">{{ payObj['total'] }} FCFA</div>
          </div>
        </div>
        <div class="ban">
          <div class="myico green_bg">
            <ion-icon :icon="cash" />
          </div>
          <div class="ban_cont">
            <div class="title_b">Solde disponible</div>
            <div class="contentb">{{ payObj['dispo'] }} FCFA</div>
          </div>
        </div>
        <div class="ban">
          <div class="myico orange_bg">
            <ion-icon :icon="people" />
          </div>
          <div class="ban_cont">
            <div class="title_b">Tarif par defaut</div>
            <div class="contentb">{{ payObj['price'] }} FCFA/10vues</div>
          </div>
        </div>
        <div class="d_sp mbut">
          <div @click="retire_all()" style="padding-bottom: 1rem;">
            <ion-button mode="ios" color="primary" expand="full" shape="round">Retirer</ion-button>
          </div>
        </div>
        <div class="seperator">

        </div>
        <div class="body_c">
          <div class="t_title">
            Historiques des paiements
          </div>
          <div v-if="payObj['payments'].length" class="card_cont">
            <div v-for="pay in payObj['payments']" :key="pay.id" class="d_sp">
              <div class="card">
                <div class="card_info">
                  <div class="card_name">
                    {{ pay.name }}
                  </div>
                  <div>
                    <div class="stat_">
                      <div class="show_p" :style="{
                        'background-color': pay.get_color,
                      }">

                      </div>
                      <div class="stat_text">
                        {{ pay.status }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card_label">
                  {{ pay.name == 'Versement' ? '+' + pay.montant : '-' + pay.montant }} F
                </div>
              </div>
            </div>
          </div>
          <div v-else >
            <div class="my_svg" >
              <img :src="'../../img/pay.svg'" style="width: 70%;" />
            </div>
            <div style="text-align: center; font-size: 0.9rem; padding-top: 0.3rem;">
              Aucun paiement pour le moment
            </div>
          </div>
        </div>
      </div>
      <div class="body_all" v-else>
        <div class="global_spinner">
          <div>
            <ion-spinner color="primary" name="circles"></ion-spinner>
          </div>
        </div>
      </div>
      <add-momo :is-open="mOpen" :can-back="true" @close="mOpen = false"
        @done="momo => (payObj['momo'] = momo, mOpen = false)" />
    </ion-content>
  </ion-page>
</template>

<style scoped >
.my_svg {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
}

.global_spinner {
  padding-top: 40vh;
  display: flex;
  justify-content: space-around;
}

.title_b {
  font-size: 0.9rem;
  font-weight: 500;
  color: #575757;
  padding-bottom: 0.2rem;
}

.yellow_bg {
  background: rgba(234, 0, 255, 0.261);
  color: rgb(234, 0, 255);
}

.orange_bg {
  background: rgba(255, 166, 0, 0.219);
  color: orange;
}

.green_bg {
  background: rgba(0, 128, 0, 0.213);
  color: green;
}

.myico {
  margin-right: 0.9rem;
  border-radius: 100%;
  padding-bottom: 0.5rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  padding-top: 0.7rem;
}

.ban {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 15px;
  background: white;
}

.card_label {
  font-size: 1.5rem;
  font-weight: bolder;
}

.stat_text {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
}

.show_p {
  width: 15px;
  height: 15px;
  min-width: 15px;
  min-height: 15px;
  border-radius: 100%;
  margin-right: 0.1rem;
}

.stat_ {
  display: flex;
  align-items: center;
}

.card_name {
  font-size: 1.1rem;
}

.card {
  width: 100%;
  padding: 0.6rem 0.9rem;
  background: white;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.card_cont {
  padding-top: 1rem;
}

.t_title {
  font-size: 1.2rem;
  text-align: center;
  font-weight: bold;
}

.body_c {
  padding: 1rem 0.9rem;
}

.seperator {
  width: 100vw;
  height: 3px;
  background-color: rgb(116, 116, 116);

}

.mbut {
  padding-left: 0.9rem;
  padding-right: 0.9rem;
}

.montant {
  font-size: 1.5rem;
  font-weight: bolder;
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
import { show_alert, show_warn } from '@/global/utils';
import { access_tok, showLoading } from '@/global/utils';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, onIonViewDidEnter, } from '@ionic/vue';
import axios from 'axios';
import { cash, people } from "ionicons/icons";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const payObj = ref();
const is_first = ref(true);
const router = useRouter();
const has_retr = ref(false)
const get_pays = async () => {
  const load = is_first.value ? (await showLoading('Chargement...')) : undefined
  const resp = await axios.get("api/get_payments/", {
    headers: {
      Authorization: `Bearer ${await access_tok(router, load)}`
    }
  })
  if (resp.data['done']) payObj.value = resp.data['result'];
  setTimeout(() => {
    if (!payObj.value['momo']) mOpen.value = true;
  }, 500)
  has_retr.value = resp.data['has_retr'];

  if (load) load.dismiss();
  is_first.value = false
}

const do_retire = async () => {
  const load = await showLoading("Enregistrement...");
  const resp = await axios.get("api/retire_all/", {
    headers: {
      Authorization: `Bearer ${await access_tok(router, load)}`
    }
  })
  if (resp.data['done']) (payObj.value['payments'] as any[]).unshift(resp.data['result']);
  has_retr.value = resp.data['has_retr'];
  load.dismiss()
  await show_alert("Retrait lancé", "Demande de retrait enregistré avec succès. Vous recevrez avant demain l'argent sur votre compte momo.")
}

const mOpen = ref(false);

const retire_all = async () => {
  if (has_retr.value) return show_alert('Impossible', "Vous avez deja un retrait en cours.")
  if (!payObj.value['momo']) return mOpen.value = true;
  if (payObj.value['dispo'] < 100) return show_alert("Fonds insuffisant", "Pour un retrait, vous devez disposer d'au moins 100 FCFA.")
  const warn_ = await show_warn("Confirmation requise", "Etes-vous sûre de vouloir lancer le retrait? Cette opération est irréversible.", "Oui", do_retire)
}


onIonViewDidEnter(() => {
  get_pays()
})

</script>
