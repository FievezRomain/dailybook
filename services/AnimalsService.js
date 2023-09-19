import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class AnimalsService {
    async createWithPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then((response) => {
            return response.data;
        })
        .catch();
    }
    
    async createWithoutPicture(body){
        return axios.post(`${getBaseUrl()}createEquide`, body)
        .then((response) => {
            return response.data;
        })
        .catch();
    }
    async create(body) {
        await this.updateAxiosAuthorization();
        if (body.image === undefined){
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
        .then((response) => {
            return response.data;
        })
        .catch();
    }

    async modifyWithPicture(body){
        return axios.put(`${getBaseUrl()}modifyEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then((response) => {
            return response.data;
        })
        .catch();
    }

    async modify(body) {
        await this.updateAxiosAuthorization();
        if (body.image === undefined){
            return this.modifyWithoutPicture(body);
        } else{
            return this.modifyWithPicture(body);
        }
    }

    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteEquide`, {data: body})
        .then((response) => {
            return response.data;
        })
        .catch();
    }

    async getAnimals(id){
        await this.updateAxiosAuthorization();
        return axios
        .get(`${getBaseUrl()}equideByUser?idProprietaire=${id}`)
        .then(({data}) => {
            return data
        })
        .catch();
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
}