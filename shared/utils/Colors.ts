import chroma from 'chroma-js';
import variables from '../../styles/Variables';

const appPalette = [
  variables.alezan,
  variables.bai,
  variables.bai_brun,
];

export const generateRandomColor = (): string =>
  chroma.random().hex();

export const getComplementaryColor = (baseColor: string): string =>
  chroma(baseColor).set('hsl.h', '+180').hex();

export const generateExtendedPalette = (count: number): string[] =>
  chroma.scale(appPalette).mode('lab').colors(count);

export const getReadableTextColor = (color: string): 'white' | 'black' =>
  chroma.contrast(color, 'white') > 4.5 ? 'white' : 'black';

interface DataItem {
  name?: string;
  value?: number;
  [key: string]: unknown;
}

interface ColorConfig {
  default_dark: string;
}

export const addColorsToData = (data: DataItem[], colors: ColorConfig): DataItem[] => {
  const colorsGenerated = generateExtendedPalette(data.length);
  return data.map((item, index) => ({
    ...item,
    color: colorsGenerated[index],
    legendFontColor: colors.default_dark,
  }));
};
