import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class WishService {

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createWish`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateWish`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteWish`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch();
    }

    async getWishs(id){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}wishsByUser?idProprietaire=${id}`)
            .then(async({data}) => {
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
        let wishs = await AsyncStorage.getItem("wishs");
        return wishs ? true : false;
     }

     async getCache() {
        let wishs = await AsyncStorage.getItem("wishs");
        return wishs ? JSON.parse(wishs) : null;
     }

    async putInCache(wishs) {
        if(await this.isInCache()){
            let wishs = JSON.parse(await AsyncStorage.getItem("wishs"));

            wishs.forEach((wish) => {
                var indice = wishs.findIndex((a) => a.id == wish.id);

                if(indice === -1){
                    wishs.push(wish);
                } else{
                    wishs[indice] = wish;
                }
            });

            await AsyncStorage.setItem("wishs",  JSON.stringify(wishs));
        } else {
            await AsyncStorage.setItem("wishs", Array.isArray(wishs) ? JSON.stringify(wishs) : JSON.stringify([wishs]));
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
}