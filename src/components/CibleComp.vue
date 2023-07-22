<template>
    <ion-modal :is-open="isOpen">
        <ion-header mode="ios">
            <ion-toolbar>
                <ion-buttons v-if="!isHome" slot="start">
                    <ion-button @click="close_()" color="danger"> Retour </ion-button>
                </ion-buttons>
                <ion-title>{{ !isHome ? 'Invitations' : 'Compte inactif' }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>

            <div class="body_all status">
                <div class="header">
                    Nombre de personnes ayant participé au quiz
                </div>
                <div class="comp">
                    <button class="boule">
                        {{ cible?.total_c }}
                    </button>
                </div>
                <div v-if="isHome" style="text-align: center; padding-bottom: 0.5rem; padding-left: 0.5rem; padding-right: 1rem; font-size: 1.1rem;">
                    Vous devez atteindre au moins {{ must }} participation avant l'activation de votre compte
                </div>
                <ion-list :inset="true" mode="ios">
                    <ion-list-header>
                        <ion-label>Quiz d'audience</ion-label>
                    </ion-list-header>
                    <div style="padding-left: 1rem; ">
                        <div> Invitez massivement ceux qui suivent vos statuts à participer a ce quiz afin de les
                            proposer des contenus qui les interesseront. </div>
                    </div>
                    <div style="padding-left: 0.6rem; padding-right: 0.6rem;">
                        <div class="editable-div" contenteditable>
                            {{ cible?.cibleObj.url }}
                        </div>
                        <div style="padding-bottom: 0.7rem;">
                            <ion-button @click="share_quiz()" fill="outline" mode="ios" expand="full" shape="round">
                                <ion-icon :icon="shareSocial" slot="start" /> Inviter
                            </ion-button>
                        </div>
                    </div>
                </ion-list>
            </div>
        </ion-content>
    </ion-modal>
</template>

<style scoped >
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
.boule {
    width: 160px;
    height: 160px;
    min-height: 160px;
    min-width: 160px;
    border-radius: 100%;
    font-size: 3rem;
    font-weight: bolder;
    border-width: 8px;
    border-color: #5e17eb;
    background-color: white;
}

.comp {
    padding: 2rem;
    display: flex;
    justify-content: space-around;

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
</style>

<script lang="ts" setup >
import { IonModal, IonHeader, IonLabel, IonContent, IonToolbar, IonButton, IonButtons, IonTitle } from '@ionic/vue';
import { computed } from 'vue';
import { Share } from '@capacitor/share';
import { shareSocial } from 'ionicons/icons';


const props = defineProps({
    isOpen: Boolean,
    cible: Object,
    isHome: Boolean
})


const share_quiz = async () => {
    try {
        await Share.share(props.cible?.cibleObj);
    } catch (e) {
        navigator.share(props.cible?.cibleObj)
    }
}

const emit = defineEmits(['close'])

const close_ = () => {
    emit('close')
}

const must = computed(() => {
    if (props.cible) return Math.floor(props.cible.must);
    else return 4
})

</script>