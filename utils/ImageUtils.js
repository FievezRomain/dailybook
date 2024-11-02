import * as ImageManipulator from 'expo-image-manipulator';
import LoggerService from '../services/LoggerService';
import { Image } from 'react-native';

export default class DateUtils {
    async compressImage (uri) {
        try {
            // Récupérer les dimensions de l'image d'origine avec Image.getSize
            const { width, height } = await new Promise((resolve, reject) => {
                Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
            });

            // Redimensionner en gardant les proportions
            const maxWidth = 800; // Spécifiez ici une largeur maximale raisonnable
            const scaleFactor = maxWidth / width;
            const newHeight = height * scaleFactor;


            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [
                    {
                        resize: {
                            width: maxWidth,
                            height: newHeight,
                        },
                    },
                ],
                {
                compress: 0.5, // Niveau de compression (0 à 1, où 1 est la qualité maximale)
                format: ImageManipulator.SaveFormat.JPEG, // Ou PNG selon votre besoin
                }
            );

          return manipResult.uri;
        } catch (error) {
            LoggerService.log("Erreur durant la compression d'une image :", error.message);
            return uri; // En cas d'échec, renvoie l'URI d'origine
        }
    };
}