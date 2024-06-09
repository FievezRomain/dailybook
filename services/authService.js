import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './Config';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getAuth, signOut } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

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
      console.error(error);
    });
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
        return Promise.reject("Un problème est survenu sur le serveur lors de l'authentification.");
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
    .catch();
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
      alert('Failed to get push token for push notification!');
      return;
    }
    expoToken = (await Notifications.getExpoPushTokenAsync()).data;
  
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

  async initNotifications() {
    const expoToken = await this.registerForPushNotificationsAsync();
    if (expoToken) {
      var data = {};
      data.expotoken = expoToken;
      AsyncStorage.setItem("userExpoToken", JSON.stringify(expoToken));
      return this.loginUser(data);
    }
  }
}
