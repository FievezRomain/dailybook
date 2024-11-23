import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class ObjectifService {

    constructor() {
        this.setObjectifs = null;
    }

    initialize(setObjectifs) {
        this.setObjectifs = setObjectifs;
    }

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createObjectif`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer un objectif : " + err.message )); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateObjectif`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un objectif : " + err.message )); 
    } 

    async updateTasks(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}modifySubTasks`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier les tâches d'un objectif : " + err.message )); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteObjectif`, {data: body})
        .then(async (response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un objectif : " + err.message ));
    }

    async getObjectifs(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}objectifsByUser?email=${email}`)
            .then(async({data}) => {
                await this.putInCache(data);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les objectifs : " + err.message ));
        }
        
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

     async isInCache() {
        let objectifs = await AsyncStorage.getItem("objectifs");
        return objectifs ? true : false;
     }

     async getCache() {
        let objectifs = await AsyncStorage.getItem("objectifs");
        return objectifs ? JSON.parse(objectifs) : null;
     }

    async putInCache(objectifs) {
        if(await this.isInCache()){
            let objectifsMemory = JSON.parse(await AsyncStorage.getItem("objectifs"));
            if(Array.isArray(objectifs)){
                objectifs.forEach((objectif) => {
                    var indice = objectifsMemory.findIndex((a) => a.id == objectif.id);
    
                    if(indice === -1){
                        objectifsMemory.push(objectif);
                    } else{
                        objectifsMemory[indice] = objectif;
                    }
                });
            } else{
                var indice = objectifsMemory.findIndex((a) => a.id == objectifs.id);
    
                if(indice === -1){
                    objectifsMemory.push(objectifs);
                } else{
                    objectifsMemory[indice] = objectifs;
                }
            }

            await AsyncStorage.setItem("objectifs",  JSON.stringify(objectifsMemory));
        } else {
            await AsyncStorage.setItem("objectifs", Array.isArray(objectifs) ? JSON.stringify(objectifs) : JSON.stringify([objectifs]));
        }

        if (this.setObjectifs) {
            
            this.setObjectifs(await this.getCache());
        }
    }

    async deleteInCache(objectif) {
        if(await this.isInCache()){
            let objectifs = JSON.parse(await AsyncStorage.getItem("objectifs"));

            var indice = objectifs.findIndex((a) => a.id == objectif.id);

            objectifs.splice(indice, 1);

            await AsyncStorage.setItem("objectifs",  JSON.stringify(objectifs));
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("objectifs");
        await this.getObjectifs(email);
    }
}

const objectifsServiceInstance = new ObjectifService( );

export default objectifsServiceInstance;