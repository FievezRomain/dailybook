import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class ContactService {

    constructor() {
        this.setContacts = null;
    }

    initialize(setContacts) {
        this.setContacts = setContacts;
    }

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createContact`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer un contact : " + err.message )); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateContact`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un contact : " + err.message )); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteContact`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un contact : " + err.message ));
    }

    async getContacts(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}contactsByUser?email=${email}`)
            .then(async ({data}) => {
                await this.putInCache(data.rows);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les contacts : " + err.message ));
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

        if (this.setContacts) {
            
            this.setContacts(await this.getCache());
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

    async refreshCache(email){
        await AsyncStorage.removeItem("contacts");
        await this.getContacts(email);
    }
}

const contactsServiceInstance = new ContactService( );

export default contactsServiceInstance;