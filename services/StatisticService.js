import { getBaseUrl } from './Config';
import axios from 'axios';
import LoggerService from './LoggerService';
import { getAuth } from 'firebase/auth';

class StatisticService {
    async getDepenses(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/depenses`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques de dépenses : " + err.message ));
    }

    async getEntrainements(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/entrainements`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques d'entraînements : " + err.message ));
    }

    async getBalades(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/balades`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques des balades : " + err.message ));
    }

    async getPoids(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/poids`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques des poids : " + err.message ));
    }

    async getTailles(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/tailles`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques des tailles : " + err.message ));
    }

    async getAlimentations(parameters){
        await this.updateAxiosAuthorization();
        return axios
        .post(`${getBaseUrl()}stats/alimentations`, parameters)
        .then(async({data}) => {
            return data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les statistiques des alimentations : " + err.message ));
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

const statisticServiceInstance = new StatisticService( );

export default statisticServiceInstance;