import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import LoggerService from './LoggerService';

class GroupService {

    constructor() {
        this.setGroups = null;
    }

    initialize(setGroups) {
        this.setGroups = setGroups;
    }

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}groups/create`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour créer une groupe : " + err.message )); 
    } 

    async modify(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}modify`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier une groupe : " + err.message )); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}delete`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour supprimer une groupe : " + err.message ));
    }

    async getGroups(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}groups?email=${email}`)
            .then(async({data}) => {
                await this.putInCache(data.rows);
                return await this.getCache();
            })
            .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer les groupes : " + err.message ));
        }
    }

    async inviteMembers(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}groups/invite`, body)
        .then(async(response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour inviter des membres dans un groupe : " + err.message )); 
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
        let groups = await AsyncStorage.getItem("groups");
        return groups ? true : false;
     }

     async getCache() {
        let groups = await AsyncStorage.getItem("groups");
        return groups ? JSON.parse(groups) : null;
     }

    async putInCache(groups) {
        if(await this.isInCache()){
            let groupsMemory = JSON.parse(await AsyncStorage.getItem("groups"));
            if(Array.isArray(groups)){
                groups.forEach((group) => {
                    var indice = groupsMemory.findIndex((a) => a.id == group.id);
    
                    if(indice === -1){
                        groupsMemory.push(group);
                    } else{
                        groupsMemory[indice] = group;
                    }
                });
            } else{
                var indice = groupsMemory.findIndex((a) => a.id == groups.id);
    
                if(indice === -1){
                    groupsMemory.push(groups);
                } else{
                    groupsMemory[indice] = groups;
                }
            }

            await AsyncStorage.setItem("groups",  JSON.stringify(groupsMemory));
        } else {
            await AsyncStorage.setItem("groups", Array.isArray(groups) ? JSON.stringify(groups) : JSON.stringify([groups]));
        }

        if (this.setGroups) {
            
            this.setGroups(await this.getCache());
        }
    }

    async deleteInCache(group) {
        if(await this.isInCache()){
            let groups = JSON.parse(await AsyncStorage.getItem("groups"));

            var indice = groups.findIndex((a) => a.id == group.id);

            groups.splice(indice, 1);

            await AsyncStorage.setItem("groups",  JSON.stringify(groups));

            if (this.setGroups) {
            
                this.setGroups(await this.getCache());
            }
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("groups");
        await this.getGroups(email);
    }
}

const groupServiceInstance = new GroupService( );

export default groupServiceInstance;