import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class AnimalsService {
    /* async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createEquide`, body, {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data) => {return data;}
        })
        .then((res) => res.data)
        .catch();
    } */

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createEquide`, body)
        .then(({res}) => {
            return res;
        })
        .catch();
    }

    async getAnimals(id){
        await this.updateAxiosAuthorization();
        return axios
        .get(`${getBaseUrl()}equideByUser?idProprietaire=${id}`)
        .then(({data}) => {
            console.log(data)
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