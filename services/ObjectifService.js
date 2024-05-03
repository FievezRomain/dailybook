import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class ObjectifService {

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createObjectif`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateObjectif`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 

    async updateTasks(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}modifySubTasks`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteObjectif`, {data: body})
        .then(async (response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch();
    }

    async getObjectifsPerAnimals(id){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}objectifsPerAnimalsByUser?idProprietaire=${id}`)
            .then(async ({data}) => {
                await this.putInCache(data);
                return await this.getCache();
            })
            .catch();
        }
        
    }

    async getObjectifs(id){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}objectifsByUser?idProprietaire=${id}`)
            .then(async({data}) => {
                await this.putInCache(data);
                return await this.getCache();
            })
            .catch();
        }
        
    }

    async updateAxiosAuthorization() {
        let token = await this.getAuthToken();
        if (token) {
            //Bonne solution pour connexion
            axios.defaults.headers.common = { 'x-access-token': `${token}` };
            //Avec bearer en plus le temps de faire l'enregistrement
            //axios.defaults.headers.common = { 'x-access-token': `bearer ${token}` };
        }else {
          delete axios.defaults.headers.common["x-access-token"];
        }
    }

    async getAuthToken() {
        let auth = await AsyncStorage.getItem("auth");
        return auth ? JSON.parse(auth) : null;
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
            let objectifs = JSON.parse(await AsyncStorage.getItem("objectifs"));

            objectifs.forEach((objectif) => {
                var indice = objectifs.findIndex((a) => a.id == objectif.id);

                if(indice === -1){
                    objectifs.push(objectif);
                } else{
                    objectifs[indice] = objectif;
                }
            });

            await AsyncStorage.setItem("objectifs",  JSON.stringify(objectifs));
        } else {
            await AsyncStorage.setItem("objectifs", Array.isArray(objectifs) ? JSON.stringify(objectifs) : JSON.stringify([objectifs]));
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
}