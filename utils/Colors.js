import chroma from 'chroma-js';
import variables from '../components/styles/Variables';

// Palette principale de l'application
const appPalette = [
    variables.alezan,
    variables.bai,
    variables.bai_brun
];

/**
 * Génère une couleur aléatoire harmonieuse à partir de la palette de l'application.
 */
export const generateRandomColor = () =>
  chroma.random().hex();

/**
 * Génère des couleurs complémentaires à partir d'une couleur donnée.
 * @param {string} baseColor - Couleur de base au format HEX.
 * @returns {string} Couleur complémentaire au format HEX.
 */
export const getComplementaryColor = (baseColor) =>
  chroma(baseColor).set('hsl.h', '+180').hex();

/**
 * Génère une palette étendue à partir des couleurs principales de l'application.
 * @param {number} count - Nombre de couleurs à générer.
 * @returns {string[]} Palette de couleurs harmonieuses.
 */
export const generateExtendedPalette = (count) =>
  chroma.scale(appPalette).mode('lab').colors(count);

/**
 * Vérifie si une couleur est lisible avec du texte blanc ou noir.
 * @param {string} color - Couleur de fond au format HEX.
 * @returns {string} 'white' ou 'black'.
 */
export const getReadableTextColor = (color) =>
  chroma.contrast(color, 'white') > 4.5 ? 'white' : 'black';

/**
 * Ajoute des couleurs harmonieuses à un ensemble de données pour un graphique.
 * @param {Array} data - Tableau d'objets contenant des données (name, value).
 * @returns {Array} Tableau d'objets avec des couleurs ajoutées.
 */
export const addColorsToData = (data) => {
  const colors = generateExtendedPalette(data.length);
  return data.map((item, index) => ({
    ...item,
    color: colors[index],
  }));
};
