import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';
import eventsServiceInstance from "./EventService";
import objectifsServiceInstance from './ObjectifService';

class AnimalsService {

    constructor() {
        this.setAnimaux = null;
    }

    initialize(setAnimaux) {
        this.setAnimaux = setAnimaux;
    }

    async createWithPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour enregistrer un animal avec une image : " + err.message ));
    }
    
    async createWithoutPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour enregistrer un animal sans image : " + err.message ));
    }
    async create(body) {
        await this.updateAxiosAuthorization();
        if (body._parts === undefined){
            return this.createWithoutPicture(body);
        } else{
            return this.createWithPicture(body);
        }
    }

    async createHistory(body){
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createEquideHistory`, body)
        .then(async (response) => {
            if( response.data.rows ){
                await this.putInCache( response.data.rows );
                return response.data.rows;
            }
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour enregistrer une modification du physique : " + err.message ));
    }

    async modifyHistory(body){
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}modifyEquideHistory`, body)
        .then(async (response) => {
            if( response.data.rows ){
                await this.putInCache( response.data.rows );
                return response.data.rows;
            }
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un élément de l'historique du physique : " + err.message ));
    }

    async deleteHistory(body){
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}deleteEquideHistory`, body)
        .then(async (response) => {
            if( response.data.rows ){
                await this.putInCache( response.data.rows );
                return response.data.rows;
            }
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un élément de l'historique du physique : " + err.message ));
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
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un animal sans image : " + err.message ));
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
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un animal avec une image : " + err.message ));
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
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un animal : " + err.message ));
    }

    async getAnimals(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}equideByUser?email=${email}`)
            .then(async ({data}) => {
                await this.putInCache(data.rows);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les animaux : " + err.message ));
        }
    }

    async getAnimalBodyPictures(idanimal, email){
        await this.updateAxiosAuthorization();
        return axios
            .get(`${getBaseUrl()}bodyPictures?email=${email}&idanimal=${idanimal}`)
            .then(async ({data}) => {
                return data.rows;
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les images du physique de l'animal " + idanimal + " : " + err.message ));
    }

    async deleteAnimalBodyPicture(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteBodyPicture`, {data: body})
        .then(async (response) => {
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer une image du physique d'un animal : " + err.message ));
    }

    async addAnimalBodyPicture(body){
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}addBodyPicture`, body)
        .then(async (response) => {
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour enregistrer une image du physique d'un animal : " + err.message ));
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
        let animals = await AsyncStorage.getItem("animals");
        return animals === null ? false : true;
    }

    async getCache() {
        let animals = await AsyncStorage.getItem("animals");
        return animals ? JSON.parse(animals) : null;
    }

    async putInCache(animals) {
        if(await this.isInCache()){
            let animalsMemory = JSON.parse(await AsyncStorage.getItem("animals"));
            if(Array.isArray(animals)){
                animals.forEach((animal) => {
                    var indice = animalsMemory.findIndex((a) => a.id == animal.id);
    
                    if(indice === -1){
                        animalsMemory.push(animal);
                    } else{
                        animalsMemory[indice] = animal;
                    }
                });
            } else {
                var indice = animalsMemory.findIndex((a) => a.id == animals.id);
    
                    if(indice === -1){
                        animalsMemory.push(animals);
                    } else{
                        animalsMemory[indice] = animals;
                    }
            }

            await AsyncStorage.setItem("animals",  JSON.stringify(animalsMemory));
        } else {
            await AsyncStorage.setItem("animals", Array.isArray(animals) ? JSON.stringify(animals) : JSON.stringify([animals]));
        }

        if (this.setAnimaux) {
            
            this.setAnimaux(await this.getCache());
        }
    }

    async deleteInCache(animal) {
        if(await this.isInCache()){

            // Mise à jour des events suite à la potentielle suppression en cascade
            await eventsServiceInstance.refreshCache(animal.email);
            await objectifsServiceInstance.refreshCache(animal.email);

            let animals = JSON.parse(await AsyncStorage.getItem("animals"));

            var indice = animals.findIndex((a) => a.id == animal.id);

            animals.splice(indice, 1);

            await AsyncStorage.setItem("animals",  JSON.stringify(animals));

            if (this.setAnimaux) {
            
                this.setAnimaux(await this.getCache());
            }
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("animals");
        await this.getAnimals(email);
    }
}

const animalsServiceInstance = new AnimalsService( );

export default animalsServiceInstance;