import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './Config';
import axios from 'axios';

export default class AuthService {

  loginUser(data) {
    axios.defaults.headers.common = {};
    return axios
    .post(`${getBaseUrl()}login`, data)
    .then((response) => {
      const data = response.data;
      console.log(data);
      if (!data?.tokenCode) {
        this.storeAuthInformation(data.token);
        this.updateAxiosAuthorization();
      }
      return data
    })
  }

  confirmLogin(token, body) {
    axios.defaults.headers.common = {};
    return axios
    .post(`${getBaseUrl()}auth/${token}/confirm_login`, body)
    .then((response) => {
      const data = response.data;
      this.storeAuthInformation(data.token);
      this.updateAxiosAuthorization();
      return data
    });
  }

  async getUser() {
    await this.updateAxiosInterceptors();
    await this.updateAxiosAuthorization();
    const user = await this.getUserLogged();
    return user;
  }

  async updateAxiosInterceptors() {
    axios.interceptors.response.use(undefined, (error) => {
      const { status } = error.response;
      if (status === 401) {
        this.removeAuthInformation()
        if(RootNavigation.navigationRef.current.getCurrentRoute().name !== "Login"){
          RootNavigation.navigate("Home");
        }
      }
      return Promise.reject(error);
    });
  }

  async updateAxiosAuthorization() {
    let token = await this.getAuthToken();
    if (token) {
        axios.defaults.headers.common = { Authorization: `bearer ${token}` };
    }else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  async storeAuthInformation(token) {
    await AsyncStorage.setItem("auth", JSON.stringify(token));
  }

  async removeAuthInformation() {
    await AsyncStorage.removeItem("auth");
  }

  async getAuthToken() {
    let auth = await AsyncStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  }

  async getUserLogged() {
    await this.updateAxiosAuthorization();
    return axios
    .get(`${getBaseUrl()}current_user`)
    .then(({data}) => {
      return data
    });
  }

  async register(body) {
    return axios.post(`${getBaseUrl()}register`, body)
    .then((res) => res.data)
    .catch();
  }
}
