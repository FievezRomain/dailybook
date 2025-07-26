import awsconfig from '../../aws-exports';
import LoggerService from '../logs/LoggerService';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import "react-native-get-random-values";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const s3 = new S3Client(awsconfig);

export default class FileStorageService {

    async uploadFile (fileUri, fileName, contentType, firebaseUserId, directory = "") {
        try {
            const response = await fetch(fileUri);
            const blob = await response.blob();

            const filePath = `${firebaseUserId}/${directory}${fileName}`;
            
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

    async openDocumentWithCache (url, filename) {
        try {
            const LOCAL_DIRECTORY = FileSystem.documentDirectory + 'vascoandco/documents/';
            // Création du dossier si besoin
            const dirInfo = await FileSystem.getInfoAsync(LOCAL_DIRECTORY);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(LOCAL_DIRECTORY, { intermediates: true });
            }

            const fileUri = `${LOCAL_DIRECTORY}${filename}`;

            // Vérifier si le fichier existe déjà localement
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                console.log("Téléchargement du fichier...");
                await FileSystem.downloadAsync(url, fileUri);
            } else {
                console.log("Fichier déjà en cache.");
            }

            // Ouvrir avec la visionneuse native (si disponible)
            const isSharingAvailable = await Sharing.isAvailableAsync();

            if (isSharingAvailable) {
                await Sharing.shareAsync(fileUri);
            } else {
                alert("Impossible d'ouvrir ce document sur cet appareil.");
            }
        } catch (error) {
            if (error.message.includes('ENOSPC')) {
                alert("Votre espace de stockage est insuffisant pour télécharger ce fichier.");
            } else {
                console.log("erreur dl : ", error)
                alert("Une erreur est survenue lors du téléchargement.");
            }
            LoggerService.log("Erreur d'ouverture du document : ", error.message);
        }
    };

    async deleteFile(fileName, firebaseUserId) {
        try {
            const filePath = `${firebaseUserId}/${fileName}`;
            const params = {
                Bucket: 'vascoandco-storage',
                Key: filePath,
            };

            const command = new DeleteObjectCommand(params);
            await s3.send(command);
        } catch (error) {
            LoggerService.log("Erreur pendant la suppression du fichier : ", error.message);
        }
    }

}