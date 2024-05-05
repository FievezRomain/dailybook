import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class ContactService {

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createContact`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateContact`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteContact`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch();
    }

    async getContacts(id){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}contactsByUser?idProprietaire=${id}`)
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
        let contacts = await AsyncStorage.getItem("contacts");
        return contacts ? true : false;
     }

     async getCache() {
        let contacts = await AsyncStorage.getItem("contacts");
        return contacts ? JSON.parse(contacts) : null;
     }

    async putInCache(contacts) {
        if(await this.isInCache()){
            let contactsMemory = JSON.parse(await AsyncStorage.getItem("contacts"));
            if(Array.isArray(contacts)){
                contacts.forEach((contact) => {
                    var indice = contactsMemory.findIndex((a) => a.id == contact.id);
    
                    if(indice === -1){
                        contactsMemory.push(contact);
                    } else{
                        contactsMemory[indice] = contact;
                    }
                });
            } else{
                var indice = contactsMemory.findIndex((a) => a.id == contacts.id);
    
                    if(indice === -1){
                        contactsMemory.push(contacts);
                    } else{
                        contactsMemory[indice] = contacts;
                    }
            }

            await AsyncStorage.setItem("contacts",  JSON.stringify(contactsMemory));
        } else {
            await AsyncStorage.setItem("contacts", Array.isArray(contacts) ? JSON.stringify(contacts) : JSON.stringify([contacts]));
        }
    }

    async deleteInCache(contact) {
        if(await this.isInCache()){
            let contacts = JSON.parse(await AsyncStorage.getItem("contacts"));

            var indice = contacts.findIndex((a) => a.id == contact.id);

            contacts.splice(indice, 1);

            await AsyncStorage.setItem("contacts",  JSON.stringify(contacts));
        }
    }
}