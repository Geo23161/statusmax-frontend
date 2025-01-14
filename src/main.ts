import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import vue3PhotoPreview from 'vue3-photo-preview'
import { IonicVue } from '@ionic/vue';
import 'vue3-photo-preview/dist/index.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

import 'plyr/dist/plyr.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import axios from "axios"

/* Theme variables */
import './theme/variables.css';

//const base = "http://192.168.43.244:8080/"
const base = "https://business.statusmax.site/"

axios.defaults.baseURL = base

const app = createApp(App)
  .use(IonicVue)
  .use(vue3PhotoPreview)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});