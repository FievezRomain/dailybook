import * as ImageManipulator from 'expo-image-manipulator';
import LoggerService from '../../services/logs/LoggerService';
import { Image } from 'react-native';

export default class ImageUtils {
  async compressImage(uri: string): Promise<string> {
    try {
      const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject);
      });

      const maxWidth = 800;
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
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return manipResult.uri;
    } catch (error: unknown) {
      LoggerService.log("Erreur durant la compression d'une image : " + (error as Error).message);
      return uri;
    }
  }
}
