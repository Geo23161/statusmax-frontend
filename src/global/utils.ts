import { Storage } from "@ionic/storage"
import { alertController, loadingController, toastController } from "@ionic/vue";
import axios from "axios";
import { Router } from "vue-router";

export const check_connect = async () => {
    const storage = new Storage({
        name: "x_info",
    });
    storage.create();
    const token: string | undefined = await storage.get('tokens')
    if (!token) return false
    else {
        const json_tok = JSON.parse(token)
        try {
            const resp = await axios({
                url: 'api/ping',
                method: 'HEAD',
                headers: {
                    Authorization: `Bearer ${json_tok.access}`
                },
            })
            return true
        } catch (err: any) {
            if (err.response.status == 401) {
                const form = new FormData()
                form.append('refresh', json_tok.refresh)
                try {
                    const refresh_res = await axios({
                        url: 'token/refresh/',
                        method: 'POST',
                        data: form
                    })
                    json_tok.access = refresh_res.data['access']
                    storage.set('tokens', JSON.stringify(json_tok))
                    return true
                } catch (err: any) {
                    if (err.response.status == 401) return false
                }
            }
        }
    }
}

export const showLoading = async (mess: string) => {
    const loading = await loadingController.create({
        message: mess,
    });
    loading.present();
    return loading
};

export const show_alert = async (title: string, mess: string) => {
    const alert = await alertController.create({
        header: title,
        message: mess,
        buttons: ["OK"],
    });

    await alert.present();
};

export const access_tok = async (router: Router, load : HTMLIonLoadingElement|undefined) => {
    const storage = new Storage({
        name: "x_info",
    });
    storage.create();
    const token: string | undefined = await storage.get('tokens')
    if (!token){
        if (load) load.dismiss();
        return router.push(`/login`)
    } 
    else {
        const json_tok = JSON.parse(token)
        try {
            const resp = await axios({
                url: 'api/ping',
                method: 'HEAD',
                headers: {
                    Authorization: `Bearer ${json_tok.access}`
                },
            })
            return json_tok.access as string
        } catch (err: any) {
            if (err.response.status == 401) {
                const form = new FormData()
                form.append('refresh', json_tok.refresh)
                try {
                    const refresh_res = await axios({
                        url: 'token/refresh/',
                        method: 'POST',
                        data: form
                    })
                    json_tok.access = refresh_res.data['access']
                    storage.set('tokens', JSON.stringify(json_tok))
                    return refresh_res.data['access'] as string
                } catch (err: any) {
                    if (err.response.status == 401) return router.push(`/login`)
                }
            }
        }
    }
}

export const show_warn = async (title: string, mess: string, but1: string, handler1: () => Promise<void>) => {
    const alert = await alertController.create({
        header: title,
        message: mess,
        buttons: [
            {
                text: 'Fermer',
                role: 'cancel'
            },
            {
                text: but1,
                role: 'confirm',
                handler: () => {
                    handler1()
                },
            },
        ],
    });

    await alert.present();
};