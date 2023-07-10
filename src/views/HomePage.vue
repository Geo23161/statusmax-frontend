<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button default-href="/tabs/"></ion-back-button>
				</ion-buttons>
				<ion-title>Posts {{ title }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<div class="body_all">
				<div v-if="title == ''">
					<div class="global_spinner">
						<div>
							<ion-spinner color="primary" name="circles"></ion-spinner>
						</div>
					</div>
				</div>
				<div style="padding-left: 0.5rem; padding-right: 0.5rem;" v-else>
					<ion-list style="background-color: rgb(234, 227, 240);">
						<div v-for="p in posts" :key="p.id" class="d_sp">
							<ion-card mode="ios">
								<div @click="p.media.is_vid ? (vOpen = true, cUrl = p.media.vid_url) : click_img(p.media.id)" class="img" :style="{
									'background-image': `url(${p.media.get_url})`,
									'background-position': 'top center',
									'background-size': 'cover',
									'position': 'relative'
								}">
									<button class="play_b" v-if="p.media.is_vid">
										<ion-icon slot="start" :icon="play"></ion-icon>
									</button>
								</div>
								<ion-card-header>
									<ion-card-title> {{ p.get_title }}</ion-card-title>
									<ion-card-subtitle>{{ format_bonus(p.get_bonus) }}</ion-card-subtitle>
								</ion-card-header>

								<ion-button @click="cPost = p, pOpen = true" fill="clear" >{{ slug == 'proposed' ? "Accepter de poster" : "Ouvrir ce post"}}</ion-button>
							</ion-card>
						</div>
					</ion-list>
					<div v-if="p_load" style="text-align: center; padding-top: 0.8rem">
						<ion-spinner name="dots"></ion-spinner>
					</div>
					<div v-if="!is_over && !p_load" style="display: flex; justify-content: space-around">
						<div>
							<ion-button @click="getHomeFromSlug()">
								<ion-icon :icon="caretDownCircle"></ion-icon>
								<div style="padding-left: 0.5rem">Voir plus</div>
							</ion-button>
						</div>
					</div>
					<div v-if="no_data" style="text-align: center; padding-top: 0.5rem">
						Plus de données
					</div>
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
			<ion-modal mode="ios" :is-open="false">
				<ion-header>
					<ion-toolbar>
						<ion-title>Historique de paiement</ion-title>
						<ion-buttons slot="end">
							<ion-button >Fermer</ion-button>
						</ion-buttons>
					</ion-toolbar>
				</ion-header>
				<ion-content class="ion-padding"> </ion-content>
			</ion-modal>
      		<vid-player :isOpen="vOpen" :urlP="cUrl" @close="vOpen = false" />
			<post-comp :is-open="pOpen" @close="pOpen = false" :slug="slug" @see="handle_media_click(cPost.media)" :post="cPost" />
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

.img {
	width: 100%;
	height: 280px;
}

.d_sp {
	margin-top: 1rem;
	margin-bottom: 1rem;
}

.global_spinner {
	padding-top: 40vh;
	display: flex;
	justify-content: space-around;
}

.body_all {
	width: 100vw;
	min-height: 100vh;
	background: rgb(234, 227, 240);
	padding-bottom: 1rem;
}
</style>

<script lang="ts" setup >
import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonBackButton,
	IonSpinner,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonCardContent,
	IonButton,
	onIonViewDidEnter,
	IonModal
} from "@ionic/vue";
import { arrowBack, location, arrowForward, aperture, diamond, play, caretDownCircle } from "ionicons/icons";
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { show_alert, showLoading, access_tok } from "@/global/utils";
import VidPlayer from "../components/VidPlayer.vue";
import axios from "axios"
import PostComp from "@/components/PostComp.vue";

const click_img = (id: string) => {
  document.getElementById(id+ ':img')?.click();
};

const pOpen = ref(false);
const cPost = ref();

const handle_media_click = (media : any) => {
	media.is_vid ? (vOpen.value = true, cUrl.value = media.vid_url) : click_img(media.id);
}

const vOpen = ref(false);
const cUrl = ref("")

const title = ref("");
const slug = ref("proposed");
const router = useRouter();
const posts = ref<any[]>([]);
const desc = ref("");
const value = ref(0);

const all_imgs = computed(() => {
	const ls = [] as any[];
	for(const post of posts.value) if(!post.media.is_vid) ls.push(post.media)
	return ls;

})

const pks = computed(() => {
	const mypks = [] as number[];
	for(const post of posts.value) mypks.push(post.id);
	return mypks
})

const is_over = ref(false)
const p_load = ref(false)
const no_data = ref(false)

const getHomeFromSlug = async () => {
	p_load.value = true
	const resp = await axios.post("api/get_home_from_slug/" + slug.value + '/', {
		pks : JSON.stringify(pks.value)
	} ,{
		headers: {
			Authorization: `Bearer ${await access_tok(router, undefined)}`
		}
	})
	if (resp.data['done']) {
		title.value = resp.data['result']["name"];
		desc.value = resp.data['result']['desc'];
		posts.value = posts.value.concat(resp.data['result']['medias']);
		value.value = resp.data['done']['value'];
		price.value = resp.data['price'];
		p_load.value = false;
		if(!resp.data['result']['medias'].length) is_over.value = true, no_data.value = true;
		setTimeout(() => {
			no_data.value = false;
		}, 3500)
	}
}

const price = ref()
const format_bonus = (bonus : any) => {
	return `Gain de ${parseInt(price.value) + parseInt(bonus)} F/10vues`;
}

const route = useRoute();

onIonViewDidEnter(() => {
	slug.value = route.params.slug as string;
	getHomeFromSlug();
})

</script>