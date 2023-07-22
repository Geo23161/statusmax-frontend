<template>
  <ion-page>
    <ion-content>
      <div class="body_all">
        <form @submit.prevent="connect()">
          <div class="header">
            <div class="title_m">
              <div class="img_cont">
                <img :src="'../../resources/icon.png'" class="img_m" />
              </div>
              <div class="text_m">StatusMax</div>
            </div>
          </div>
          <div class="title_b">Connexion.</div>
          <div class="body_i">
            <img :src="'../../img/login.svg'" class="img_b" />
          </div>
          <div class="form_b">
            <div class="d_sp">
              <ion-item fill="outline" mode="md" color="dark">
                <ion-label position="floating">Email</ion-label>
                <ion-input
                  required
                  :value="email"
                  class="custom"
                  type="email"
                  @ionInput="(e) => (email = e.target.value as string)"
                ></ion-input>
              </ion-item>
            </div>
            <div class="d_sp">
              <ion-item fill="outline" mode="md" color="dark">
                <ion-label position="floating"> Mot de passe </ion-label>
                <ion-input
                  type="password"
                  class="custom"
                  required
                  :value="password"
                  @ionInput="(e) => (password = e.target.value as string)"
                ></ion-input>
              </ion-item>
            </div>
            <div v-if="!is_connecting" style="padding-top: 0.4rem">
              <ion-button type="submit" color="primary" expand="full"
                >Connexion</ion-button
              >
            </div>
            <div v-else>
              <ion-spinner color="primary" name="dots"></ion-spinner>
            </div>
            <div
              class="d_sp"
              style="text-align: center; color: rgb(41, 41, 41)"
            >
              Pas encore membre ?
              <a @click="router.push('/register')" style="color: #5e17eb">Inscrivez-vous ici</a>
            </div>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.form_b {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.title_b {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem;
  color: rgb(41, 41, 41);
}

.img_b {
  width: 100%;
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

.img_cont {
  margin-right: 0.3rem;
}

.text_m {
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(41, 41, 41);
}

.img_m {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}

.title_m {
  display: flex;
  align-items: center;

}

.menu:active,
.menu_:active {
  box-shadow: none;
  background: white;
  color: #5e17eb;
}

.menu {
  padding-top: 0.4rem;
  padding-bottom: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #5e17eb;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px #5e17eb65, 0 4px 6px -2px #f2824129;
}

.header {
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.d_sp {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.body_all {
  width: 100vw;
  min-height: 100vh;
  background: rgb(234, 227, 240);
  font-family: 'PT Serif', serif;
}

.ion-page{
  --ion-background-color: rgb(234, 227, 240);
}



</style>

<script setup lang="ts" >
import {
  IonPage,
  IonContent,
  IonItem,
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
  IonAvatar
} from "@ionic/vue";
import { menu, accessibility } from "ionicons/icons";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { check_connect } from "@/global/utils";
import { show_alert, showLoading, access_tok } from "@/global/utils";
import { Storage } from "@ionic/storage";
import axios from "axios";
import {StatusBar} from "@capacitor/status-bar"

StatusBar.setBackgroundColor({color : "#5e17eb"})

const email = ref("");
const password = ref("");
const router = useRouter();
const is_connecting = ref(false);
const route = useRoute();

const now_connected = ref(false);
watch(now_connected, async (newc, oldc) => {
    let stp = 0
    const load = await showLoading("Patientez...")
    const resp = await axios.get("api/get_stp/", {
      headers : {
        Authorization : `Bearer ${await access_tok(router, load)}`
      }
    })
    load.dismiss()
    if(resp.data['done']) stp = resp.data['result']
    if(stp == 3) router.push('/tabs/')
    else router.push('/create?stp=' + stp)
  })

const connect = async () => {
  const load = await showLoading("Connexion...");
  
  axios({
    url: "token/",
    method: "POST",
    data: {
      email : email.value,
      password: password.value
    },
  })
    .then((resp) => {
      load.dismiss();
      const storage = new Storage({
        name: "x_info",
      });
      storage.create();
      storage.set("tokens", JSON.stringify(resp.data));

      now_connected.value = true
    })
    .catch((err) => {
      load.dismiss();
      console.log(err);
      return show_alert(
        "Connexion impossible",
        "Veuillez vérifier vos identifiants."
      );
    });
};


onIonViewDidEnter(async () => {
  const new_ = localStorage.getItem('new_p')
  if (new_) {
    const creds : {email: string, password: string} = JSON.parse(new_);
    email.value = creds.email;
    password.value = creds.password;
    localStorage.removeItem('new_p');
    await connect();
  }
  const is_connected = await check_connect();
  if (is_connected) {
    now_connected.value= true
  } else {
    const storage = new Storage({
      name: "x_info",
    });
    storage.create();
    const emailo: string | undefined = await storage.get("email");
    const passwordo: string | undefined = await storage.get("password");
    if (emailo) email.value = emailo as string;
    if (passwordo) password.value = passwordo;
  }
});
</script>