import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class WishService {

    constructor() {
        this.setWishs = null;
    }

    initialize(setWishs) {
        this.setWishs = setWishs;
    }

    async createWithoutPicture(body) {
        return axios.post(`${getBaseUrl()}createWish`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer un wish sans image : " + err.message )); 
    } 
    async createWithPicture(body) {
        return axios.post(`${getBaseUrl()}createWish`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer un wish avec une image : " + err.message )); 
    } 
    async create(body) {
        await this.updateAxiosAuthorization();
        if (body._parts === undefined){
            return this.createWithoutPicture(body);
        } else{
            return this.createWithPicture(body);
        }
    }

    async updateWithoutPicture(body) {
        return axios.put(`${getBaseUrl()}updateWish`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un wish sans image : " + err.message )); 
    } 
    async updateWithPicture(body) {
        return axios.put(`${getBaseUrl()}updateWish`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un wish avec une image : " + err.message )); 
    } 
    async update(body) {
        await this.updateAxiosAuthorization();
        if (body._parts === undefined){
            return this.updateWithoutPicture(body);
        } else{
            return this.updateWithPicture(body);
        }
    }


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteWish`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un wish : " + err.message ));
    }

    async getWishs(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}wishsByUser?email=${email}`)
            .then(async({data}) => {
                await this.putInCache(data.rows);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les wishs : " + err.message ));
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
        let wishs = await AsyncStorage.getItem("wishs");
        return wishs ? true : false;
     }

     async getCache() {
        let wishs = await AsyncStorage.getItem("wishs");
        return wishs ? JSON.parse(wishs) : null;
     }

    async putInCache(wishs) {
        if(await this.isInCache()){
            let wishsMemory = JSON.parse(await AsyncStorage.getItem("wishs"));
            if(Array.isArray(wishs)){
                wishs.forEach((wish) => {
                    var indice = wishsMemory.findIndex((a) => a.id == wish.id);
    
                    if(indice === -1){
                        wishsMemory.push(wish);
                    } else{
                        wishsMemory[indice] = wish;
                    }
                });
            } else{
                var indice = wishsMemory.findIndex((a) => a.id == wishs.id);
    
                if(indice === -1){
                    wishsMemory.push(wishs);
                } else{
                    wishsMemory[indice] = wishs;
                }
            }

            await AsyncStorage.setItem("wishs",  JSON.stringify(wishsMemory));
        } else {
            await AsyncStorage.setItem("wishs", Array.isArray(wishs) ? JSON.stringify(wishs) : JSON.stringify([wishs]));
        }

        if (this.setWishs) {
            
            this.setWishs(await this.getCache());
        }
    }

    async deleteInCache(wish) {
        if(await this.isInCache()){
            let wishs = JSON.parse(await AsyncStorage.getItem("wishs"));

            var indice = wishs.findIndex((a) => a.id == wish.id);

            wishs.splice(indice, 1);

            await AsyncStorage.setItem("wishs",  JSON.stringify(wishs));
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("wishs");
        await this.getWishs(email);
    }
}

const wishsServiceInstance = new WishService( );

export default wishsServiceInstance;