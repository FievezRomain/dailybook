import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './Config';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import Constants from 'expo-constants';
import { getAuth, signOut } from 'firebase/auth';
import LoggerService from './LoggerService';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

export default class AuthService {

  async loginUser(data) {
    await this.updateAxiosInterceptors();
    await this.updateAxiosAuthorization();
    return axios
    .post(`${getBaseUrl()}login`, data)
    .then((response) => {
      const data = response.data;
      this.updateAxiosAuthorization();
      
      return data
    })
    .catch((error) =>{
      LoggerService.log( "Erreur lors de l'envoi de la requête du login de l'utilisateur : " + error.message )
      console.log(error);
    })
  }

  confirmLogin(token, body) {
    axios.defaults.headers.common = {};
    return axios
    .post(`${getBaseUrl()}auth/${token}/confirm_login`, body)
    .then((response) => {
      const data = response.data;
      this.updateAxiosAuthorization();
      return data
    })
    .catch((error) =>{
      LoggerService.log( "Erreur lors de l'envoi de la requête de confirmation du login de l'utilisateur : " + error.message )
      console.error(error);
    });
  }

  async getUser(email){
    await this.updateAxiosAuthorization();
    return axios
    .get(`${getBaseUrl()}user?email=${email}`)
    .then(({data}) => {
        return data;
    })
    .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour récupérer des informations d'un user : " + err.message ));
  }

  async modifyUser(user){
    await this.updateAxiosAuthorization();
    return axios
    .post(`${getBaseUrl()}user`, user)
    .then(({data}) => {
        return data;
    })
    .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour modifier les informations d'un user : " + err.message ));
  }

  /* async getUser() {
    await this.updateAxiosInterceptors();
    await this.updateAxiosAuthorization();
    const user = await this.getUserLogged();
    return user;
  } */

  async updateAxiosInterceptors() {
    axios.interceptors.response.use(undefined, (error) => {
      const { status } = error.response;
      if (status === 401) {
        signOut(getAuth());
        return Promise.reject("Token d'accès introuvable ou invalide. Veuillez vous connecter.");
      }
      if(status === 403) {
        return Promise.reject("Vous ne disposez pas des droits pour effectuer cette action.");
      }
      if(status === 500) {
        return Promise.reject("Un problème est survenu sur le serveur back.");
      }
      return Promise.reject(error);
    });
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

  /* async storeAuthInformation(token) {
    await AsyncStorage.setItem("auth", JSON.stringify(token));
  }

  async removeAuthInformation() {
    await AsyncStorage.removeItem("auth");
  }

  async getAuthToken() {
    let auth = await AsyncStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  } */

  /* async getUserLogged() {
    await this.updateAxiosInterceptors();
    await this.updateAxiosAuthorization();
    return axios
    .get(`${getBaseUrl()}isLogged`)
    .then(({data}) => {
      return data
    })
    .catch(function (error) {
        console.log(error.response);
    });
  } */

  async register(body) {
    return axios.post(`${getBaseUrl()}register`, body)
    .then((res) => res.data)
    .catch((err) => LoggerService.log( "Erreur lors de l'envoi de la requête pour enregistrer un user en BDD : " + err.message ));
  }

  async registerForPushNotificationsAsync() {
    let expoToken;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    expoToken = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId
    })).data;
    if (Constants.platform.android) {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return expoToken;
  }

  async getUserInformations() {
    const expoToken = await this.registerForPushNotificationsAsync();
    const calendars = await Localization.getCalendars();
    var userTimezone = "Europe/Warsaw";
    var data = {};

    if (calendars.length > 0) {
      userTimezone = calendars[0].timeZone;
      AsyncStorage.setItem("userTimezone", JSON.stringify(userTimezone));
    }
    if(expoToken){
      AsyncStorage.setItem("userExpoToken", JSON.stringify(expoToken));
    }

    data.timezone = userTimezone;
    data.expotoken = expoToken;
    return this.loginUser(data);
  }

  async initTrackingActivity() {
    if (Platform.OS === 'ios') {
      const { status } = await TrackingTransparency.getTrackingPermissionsAsync();
      if (status !== "granted") {
        // Demande la permission ATT
        const { status: newStatus } = await TrackingTransparency.requestTrackingPermissionsAsync();
        if (newStatus === 'granted') {
          console.log("Autorisation acceptée");
        } else {
          console.log("Autorisation refusée");
        }
      }
    }
  }
}
