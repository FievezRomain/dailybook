import Constants from 'expo-constants';

const awsconfig = {
    region: Constants.expoConfig.extra.EXPO_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: Constants.expoConfig.extra.EXPO_PUBLIC_AWS_ACCESS_KEY_ID, 
        secretAccessKey: Constants.expoConfig.extra.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY 
    }
  };
  
  export default awsconfig;