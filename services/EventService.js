import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

export default class EventService {

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createEvent`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer un event : " + err.message )); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}modifyEvent`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier un event : " + err.message )); 
    } 

    async updateState(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}modifyEventState`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier le state d'un event : " + err.message )); 
    } 

    async updateCommentaireNote(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}modifyEventCommentNote`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier le commentaire et la note d'un event : " + err.message )); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteEvent`, {data: body})
        .then(async (response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer un event : " + err.message ));
    }

    async getEvents(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}eventsByUser?email=${email}`)
            .then(async({data}) => {
                await this.putInCache(data);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les events : " + err.message ));
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
        let events = await AsyncStorage.getItem("events");
        return events ? true : false;
     }

     async getCache() {
        let events = await AsyncStorage.getItem("events");
        return events ? JSON.parse(events) : null;
     }

    async putInCache(events) {
        if(await this.isInCache()){
            let eventsMemory = JSON.parse(await AsyncStorage.getItem("events"));
            if(Array.isArray(events)){
                // Supprimer les événements de eventsMemory qui ne sont pas dans le tableau events
                const eventsIds = events.map(event => event.id);
                eventsMemory = eventsMemory.filter(eventMemory => eventsIds.includes(eventMemory.id));

                events.forEach((event) => {
                    var indice = eventsMemory.findIndex((a) => a.id == event.id);

                    if(indice === -1){
                        eventsMemory.push(event);
                    } else{
                        eventsMemory[indice] = event;
                    }
                });
            } else{
                var indice = eventsMemory.findIndex((a) => a.id == events.id);

                if(indice === -1){
                    eventsMemory.push(events);
                } else{
                    eventsMemory[indice] = events;
                }
            }
            await AsyncStorage.setItem("events",  JSON.stringify(eventsMemory));
        } else {
            await AsyncStorage.setItem("events", Array.isArray(events) ? JSON.stringify(events) : JSON.stringify([events]));
        }
    }

    async deleteInCache(event) {
        if(await this.isInCache()){
            let events = JSON.parse(await AsyncStorage.getItem("events"));

            // Suppression des enfants si l'event en possède
            var eventsEnfants = [];
            events.map(element => {
                if( element.idparent === event.id ){
                    eventsEnfants.push(element);
                }
            })

            eventsEnfants.map(element => {
                var index = events.findIndex(objet => objet.id === element.id);

                if(index !== -1){
                    events.splice(index, 1);
                }

            })

            // Suppression du parent
            var indice = events.findIndex((a) => a.id == event.id);

            events.splice(indice, 1);

            await AsyncStorage.setItem("events",  JSON.stringify(events));
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("events");
        await this.getEvents(email);
    }
}