const awsconfig = {
    region: process.env.EXPO_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY 
    }
  };
  
  export default awsconfig;