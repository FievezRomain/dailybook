import { getBaseUrl } from './Config';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class NotificationService {

    async getNotifications(){
        await this.updateAxiosAuthorization();
        return axios.get(`${getBaseUrl()}notifications`)
        .then(async (response) => {
            if( response ){
                return response;
            }
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les notifications d'un utilisateur : " + err.message ));
    }

    async readAll(body){
        await this.updateAxiosAuthorization();
        return axios.patch(`${getBaseUrl()}notifications/read-all`, body)
        .then(async (response) => {
            if( response ){
                return response;
            }
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour changer l'état des notifications de l'utilisateur à 'lu' : " + err.message ));
    }

    async updateAxiosAuthorization() {
        let token = await getAuth().currentUser.getIdToken();
        if (token) {
            //Bonne solution pour connexion
            axios.defaults.headers.common = { 'x-access-token': `${token}` };
            //Avec bearer en plus le temps de faire l'enregistrement
            //axios.defaults.headers.common = { 'x-access-token': `bearer ${token}` };
        }else {
            delete axios.defaults.headers.common["x-access-token"];
        }
    }
}

const notificationServiceInstance = new NotificationService( );

export default notificationServiceInstance;
