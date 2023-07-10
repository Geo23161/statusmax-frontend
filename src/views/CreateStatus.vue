<template>
	<ion-page v-if="stp == 0">
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>
					<div style="display : flex; align-items: center;"> <img style="height: 1.7rem; margin-right: 0.5rem;"
							src="../../img/whatsapp.png" />
						<div> Compte Whatsapp </div>
					</div>
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<div class="body_all">
				<div class="header">
					Ajoutez votre numero whatsapp
				</div>
				<div class="body_i">
					<img src="../../img/create.svg" class="img_b" />
				</div>
				<div style="text-align: center; padding-top: 0.6rem; padding-bottom: 0.6rem">
					Pour verifier, nous allons envoyer un code sur votre compte
				</div>
				<form class="inputs" @submit.prevent="whatsapp_auth">
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
									<ion-input required type="number" placeholder="Numéro whatsapp"
										@ionInput="(e) => (whatsapp = e.target.value as string)"></ion-input>
								</ion-item>
							</div>
						</div>
						<div style="padding-top: 0.4rem">
							<ion-button type="submit" color="primary" expand="full">Verifier</ion-button>
						</div>
					</div>
				</form>
			</div>
		</ion-content>
	</ion-page>
	<ion-page v-else-if="stp == 1">
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button color="danger" @click="stp--"> Retour </ion-button>
				</ion-buttons>
				<ion-title>Verification</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<div class="body_all">
				<div class="header">
					Entrez le code envoyé
				</div>
				<div class="body_i">
					<img src="../../img/create2.svg" class="img_b" />
				</div>

				<form @submit.prevent="check_code" class="inputs">
					<div>
						<div>

							<ion-item fill="outline" mode="md" color="primary">
								<ion-input required type="number" placeholder="Code de Verification"
									@ionInput="(e) => (code = e.target.value as string)"></ion-input>
							</ion-item>

						</div>
						<div style="padding-top: 0.4rem">
							<ion-button type="submit" color="primary" expand="full">Soumettre</ion-button>
						</div>
					</div>
				</form>
			</div>
		</ion-content>
	</ion-page>
	<ion-page v-else-if="stp == 2">
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="router.back()" color="danger"> Retour </ion-button>
				</ion-buttons>
				<ion-title>Statut Whatsapp</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>

			<div class="body_all status">
				<div class="header">
					Details sur vos statuts whatsapp
				</div>
				<div class="body_i">
					<img src="../../img/create3.svg" class="img_b" />
				</div>
				<form @submit.prevent="niv ? validate_inter() : niv++">
					<ion-list v-if="!niv" :inset="true" mode="ios">
						<ion-list-header>
							<ion-label>Audiences</ion-label>
						</ion-list-header>
						<ion-item>
							<ion-input label="Vues moyennes" type="number" required @ionInput="e => taille = e.target.value"
								:value="taille" placeholder="nombres de vues"></ion-input>

						</ion-item>
						<ion-item>
							<ion-label class="ion-text-wrap">
								<h2>Intervalle d'âges</h2>
								<p>
									<ion-range :pin="true" :pinFormatter="format_age" @ionChange="handle_ages"
										aria-label="Dual Knobs Range" :dual-knobs="true" :value="ages"></ion-range>
								</p>
								<p style="font-size : 0.8rem;">La majorite de ceux qui voient vos statuts sont dans quel
									intervalle d'âges.</p>
							</ion-label>


						</ion-item>
						<ion-item>
							<ion-input label="Nombres de femmes" :value="girls_num" type="number" required
								@ionInput="e => girls_num = e.target.value" placeholder="entrez..."></ion-input>

						</ion-item>

					</ion-list>
					<ion-list v-else-if="niv == 1" :inset="true" mode="ios">
						<ion-list-header>
							<ion-label>Centre d'Interêts acttuels</ion-label>
						</ion-list-header>

						<div style="padding-left: 1rem; padding-right: 1rem;">
							<div> Qu'est-ce qui interessent ceux qui suivent vos statuts actuellement? </div>
							<div style="padding-top: 0.9rem; padding-bottom: 0.3rem;">
								<ion-item v-for="inter in my_interest" :key="inter.id">
									<ion-label> {{ inter.name }} </ion-label>
									<ion-icon slot="start" :icon="aperture"></ion-icon>
								</ion-item>
							</div>
							<div style="padding-bottom: 0.7rem;">
								<ion-button @click="iOpen = true" mode="ios" color="primary" expand="full"
									shape="round">Choisir</ion-button>
							</div>
						</div>

					</ion-list>
					<ion-list v-else-if="niv == 2" :inset="true" mode="ios">
						<ion-list-header>
							<ion-label>Professions actuelles</ion-label>
						</ion-list-header>

						<div style="padding-left: 1rem; padding-right: 1rem;">
							<div> Quels sont les professions majoritaires de ceux qui suivent vos statuts? </div>

							<div style="padding-top: 0.9rem; padding-bottom: 0.3rem;">
								<ion-item v-for="inter in my_profs" :key="inter.id">
									<ion-label> {{ inter.name }} </ion-label>
									<ion-icon slot="start" :icon="aperture"></ion-icon>
								</ion-item>
							</div>
							<div style="padding-bottom: 0.7rem;">
								<ion-button @click="pOpen = true" mode="ios" color="secondary" expand="full"
									shape="round">Choisir</ion-button>
							</div>
						</div>

					</ion-list>
					<div
						style="padding-top: 0.3rem; padding-left: 1rem; padding-right: 1rem; display: flex; justify-content: space-between; align-items: center">
						<ion-button @click="niv--" v-if="niv" mode="ios" color="dark">Retour <ion-icon slot="start"
								:icon="arrowBack"></ion-icon>
						</ion-button>
						<ion-button mode="ios" type="submit" color="primary">Suivant <ion-icon slot="end"
								:icon="arrowForward"></ion-icon>
						</ion-button>
					</div>
				</form>
			</div>
		</ion-content>
		<ion-modal mode="ios" :is-open="false">
			<ion-header>
				<ion-toolbar>
					<ion-title>Historique de paiement</ion-title>
					<ion-buttons slot="end">
						<ion-button>Fermer</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding"> </ion-content>
		</ion-modal>
		<interest-comp :isOpen="iOpen" @close="iOpen = false" @done="(lis: any) => { my_interest = lis, iOpen = false }" />
		<prof-comp :isOpen="pOpen" @close="pOpen = false" @done="(lis: any) => { my_profs = lis, pOpen = false }" />
	</ion-page>
</template>

<style scoped>
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
	IonIcon,
	IonListHeader
} from "@ionic/vue";
import { arrowBack, location, arrowForward, aperture } from "ionicons/icons";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { show_alert, showLoading, access_tok } from "@/global/utils";
import axios from "axios"
import InterestComp from "../components/InterestComp.vue";
import ProfComp from "../components/ProfComp.vue";


const country = ref("")
const whatsapp = ref("")
const full_num = ref("")
const route = useRoute()
const router = useRouter()
const code = ref("")
const taille = ref()
const girls_num = ref()
const ages = ref({ lower: 25, upper: 40 })
const my_interest = ref<any[]>([])
const my_profs = ref<any[]>([])
const pOpen = ref(false)
const stp = ref(0);
const niv = ref(0)
watch(stp, (news, olds) => {
	if (news >= 3) router.push("/tabs/");

})

const whatsapp_auth = async () => {
	const load = await showLoading("Verification...")
	const resp = await axios.post("api/whatsapp_auth/", {
		number: whatsapp.value,
		country: country.value
	}, {
		headers: {
			Authorization: `Bearer ${await access_tok(router, load)}`
		}
	})
	load.dismiss()
	if (resp.data['done']) {
		full_num.value = resp.data['result'];
		return stp.value++;
	}
	else show_alert("Numéro incorrecte", resp.data['reason']);
}

const handle_ages = (e: any) => {
	ages.value = e.detail.value
}

const format_age = (value: number) => {
	return `${10 + Math.round(value / 100 * 60)} ans`
}

const iOpen = ref(false);
const create_stories = async () => {
	const load = await showLoading("Ajout...")
	const resp = await axios.post("api/create_stories/", {
		taille: taille.value,
		girls_num: girls_num.value,
		ages: JSON.stringify(ages.value),
		interests: JSON.stringify(my_interest.value),
		professions: JSON.stringify(my_profs.value)
	}, {
		headers: {
			Authorization: `Bearer ${await access_tok(router, load)}`
		}
	})
	if (resp.data['done']) {
		load.dismiss()
		if (only_for.value != "") return router.back();
		router.push("/tabs/")
	}
}

const validate_inter = () => {
	if (niv.value == 1) {
		niv.value++;
	} else {
		if (!my_profs.value.length) return show_alert("Impossible de continuer", "Choisir au moins une professions")
		create_stories()
	}
}

const check_code = async () => {
	const load = await showLoading("Verification...")
	const resp = await axios.post('api/check_code/', {
		code: code.value,
		number: full_num.value
	}, {
		headers: {
			Authorization: `Bearer ${await access_tok(router, load)}`
		}
	})
	load.dismiss()
	if (!resp.data['done']) show_alert("Code incorrecte", "Le code que vous avez soumis est incorrecte.")
	else {
		if (only_for.value == 'whatsapp') {
			router.back();
		}
		stp.value++;
	}
	
}

const only_for = ref("")
watch(only_for, (newo, oldo) => {
	get_details()
	if (newo == 'whatsapp') stp.value = 0;
	else if (newo == 'detail') stp.value = 2, niv.value = 0;
	else if (newo == 'interest') stp.value = 2, niv.value = 1;
	else if (newo == 'profession') stp.value = 2, niv.value = 2;
})

const get_details = async () => {
	const load = await showLoading('Patientez...')
	const resp = await axios.get('api/get_details/', {
		headers: {
			Authorization: `Bearer ${await access_tok(router, undefined)}`
		}
	})
	if (resp.data['done']) {
		const data = resp.data['result']
		taille.value = data['taille']
		ages.value = data['ages']
		girls_num.value = data['girls_num']
		my_interest.value = data['interests']
		my_profs.value = data['professions']
	}
	load.dismiss()
}

onIonViewDidEnter(() => {
	if ("stp" in route.query) stp.value = parseInt(route.query['stp'] as string)
	if ("only_for" in route.query) only_for.value = route.query['only_for'] as string
})

</script>