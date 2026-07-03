import Toast from 'react-native-toast-message';
import { eventTypeColors } from '../../../theme/tokens';

/**
 * Helpers utilisés par ModalEvents pour la conversion couleurs et la validation numérique.
 */

export function getColorByEventType(type: string | undefined): string | undefined {
  if (!type) return undefined;
  return (eventTypeColors as Record<string, string>)[type];
}

export function hexToRgba(hex: string | undefined, opacity: number): string | null {
  if (!hex) return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const expanded = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
    : null;
}

/**
 * Vérifie qu'un attribut est un nombre valide (parse "1,5" et "1.5").
 * Mute `data[attribute]` si valide. Retourne false avec Toast en cas d'erreur.
 */
export function checkNumericFormat(data: Record<string, unknown>, attribute: string): boolean {
  if (data[attribute] !== undefined && data[attribute] !== null && data[attribute] !== '') {
    const numericValue = parseFloat(String(data[attribute]).replace(',', '.').replace(' ', ''));
    if (isNaN(numericValue)) {
      Toast.show({
        position: 'top',
        type: 'error',
        text1: "Problème de format sur l'attribut " + attribute,
        text2: 'Seul les chiffres, virgule et point sont acceptés',
      });
      return false;
    }
    data[attribute] = numericValue;
  }
  return true;
}
