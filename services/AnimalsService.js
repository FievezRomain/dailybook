import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class AnimalsService {
    async createWithPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch();
    }
    
    async createWithoutPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch();
    }
    async create(body) {
        await this.updateAxiosAuthorization();
        if (body._parts === undefined){
            return this.createWithoutPicture(body);
        } else{
            return this.createWithPicture(body);
        }
    }

    /* async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createEquide`, body)
        .then((response) => {
            return response.data;
        })
        .catch();
    } */

    async modifyWithoutPicture(body){
        return axios.put(`${getBaseUrl()}modifyEquide`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch();
    }

    async modifyWithPicture(body){
        return axios.put(`${getBaseUrl()}modifyEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch();
    }

    async modify(body) {
        await this.updateAxiosAuthorization();
        if (body._parts === undefined){
            return this.modifyWithoutPicture(body);
        } else{
            return this.modifyWithPicture(body);
        }
    }

    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteEquide`, {data: body})
        .then(async (response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch();
    }

    async getAnimals(id){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}equideByUser?idProprietaire=${id}`)
            .then(async ({data}) => {
                await this.putInCache(data.rows);
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
        let animals = await AsyncStorage.getItem("animals");
        return animals === null ? false : true;
    }

    async getCache() {
        let animals = await AsyncStorage.getItem("animals");
        return animals ? JSON.parse(animals) : null;
    }

    async putInCache(animals) {
        if(await this.isInCache()){
            let animals = JSON.parse(await AsyncStorage.getItem("animals"));

            animals.forEach((animal) => {
                var indice = animals.findIndex((a) => a.id == animal.id);

                if(indice === -1){
                    animals.push(animal);
                } else{
                    animals[indice] = animal;
                }
            });

            await AsyncStorage.setItem("animals",  JSON.stringify(animals));
        } else {
            await AsyncStorage.setItem("animals", Array.isArray(animals) ? JSON.stringify(animals) : JSON.stringify([animals]));
        }
    }

    async deleteInCache(animal) {
        if(await this.isInCache()){
            let animals = JSON.parse(await AsyncStorage.getItem("animals"));

            var indice = animals.findIndex((a) => a.id == animal.id);

            animals.splice(indice, 1);

            await AsyncStorage.setItem("animals",  JSON.stringify(animals));
        }
    }
}