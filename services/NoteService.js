import { getBaseUrl } from './Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default class NoteService {

    async create(body) {
        await this.updateAxiosAuthorization();
        return axios.post(`${getBaseUrl()}createNote`, body)
        .then(async(response) => {
            await this.deleteInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 

    async update(body) {
        await this.updateAxiosAuthorization();
        return axios.put(`${getBaseUrl()}updateNote`, body)
        .then(async (response) => {
            await this.putInCache(response.data);
            return response.data;
        })
        .catch(); 
    } 


    async delete(body) {
        await this.updateAxiosAuthorization();
        return axios.delete(`${getBaseUrl()}deleteNote`, {data: body})
        .then(async(response) => {
            await this.deleteInCache(body);
            return response.data;
        })
        .catch();
    }

    async getNotes(email){
        if(await this.isInCache()){
            return await this.getCache();
        } else{
            await this.updateAxiosAuthorization();
            return axios
            .get(`${getBaseUrl()}notesByUser?email=${email}`)
            .then(async({data}) => {
                await this.putInCache(data.rows);
                return await this.getCache();
            })
            .catch();
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
        let notes = await AsyncStorage.getItem("notes");
        return notes ? true : false;
     }

     async getCache() {
        let notes = await AsyncStorage.getItem("notes");
        return notes ? JSON.parse(notes) : null;
     }

    async putInCache(notes) {
        if(await this.isInCache()){
            let notesMemory = JSON.parse(await AsyncStorage.getItem("notes"));
            if(Array.isArray(notes)){
                notes.forEach((note) => {
                    var indice = notesMemory.findIndex((a) => a.id == note.id);
    
                    if(indice === -1){
                        notesMemory.push(note);
                    } else{
                        notesMemory[indice] = note;
                    }
                });
            } else{
                var indice = notesMemory.findIndex((a) => a.id == notes.id);
    
                if(indice === -1){
                    notesMemory.push(notes);
                } else{
                    notesMemory[indice] = notes;
                }
            }

            await AsyncStorage.setItem("notes",  JSON.stringify(notesMemory));
        } else {
            await AsyncStorage.setItem("notes", Array.isArray(notes) ? JSON.stringify(notes) : JSON.stringify([notes]));
        }
    }

    async deleteInCache(note) {
        if(await this.isInCache()){
            let notes = JSON.parse(await AsyncStorage.getItem("notes"));

            var indice = notes.findIndex((a) => a.id == note.id);

            notes.splice(indice, 1);

            await AsyncStorage.setItem("notes",  JSON.stringify(notes));
        }
    }

    async refreshCache(email){
        await AsyncStorage.removeItem("notes");
        await this.getNotes(email);
    }
}