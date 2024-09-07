import awsconfig from '../aws-exports';
import LoggerService from './LoggerService';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import "react-native-get-random-values";

const s3 = new S3Client(awsconfig);

export default class FileStorageService {

    async uploadFile (fileUri, fileName, contentType, firebaseUserId) {
        try {
            const response = await fetch(fileUri);
            const blob = await response.blob();

            const filePath = `${firebaseUserId}/${fileName}`;
            
            const params = {
                Bucket: 'vascoandco-storage',        // Nom du bucket
                Key: filePath,                       // Chemin du fichier
                Body: blob,                          // Contenu du fichier
                ContentType: contentType,            // Type MIME
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);   // Envoi de la commande pour uploader
            
            const url = `https://${params.Bucket}.s3.eu-north-1.amazonaws.com/${params.Key}`;

            return url;
        } catch (error) {
            LoggerService.log("Erreur pendant le téléchargement d'un fichier: ", error.message);
        }
    }

    getFileUrl(fileName, firebaseUserId){
        const filePath = `${firebaseUserId}/${fileName}`;
        const bucket = 'vascoandco-storage';
        const url = `https://${bucket}.s3.eu-north-1.amazonaws.com/${filePath}`;

        return url;
    }

}