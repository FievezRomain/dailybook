import chroma from 'chroma-js';
import { palette } from '../../../../theme/primitives';

const vascoChartGradient = [palette.alezan, palette.baie, palette.baieBrun];

/** Reprise de la palette historique Vasco : un dégradé Lab adapté au nombre d’éléments. */
export function generateDistinctChartColors(count: number): string[] {
  if (count <= 0) return [];
  return chroma.scale(vascoChartGradient).mode('lab').colors(count);
}
