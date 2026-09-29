module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@features': './features',
            '@shared': './shared',
            '@hooks': './hooks',
            '@services': './services',
            '@stores': './stores',
            '@theme': './theme',
            '@models': './models',
            '@utils': './utils',
            '@config': './config',
            '@business': './business',
            '@navigation': './navigation',
            '@constants': './constants',
            '@types': './types',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      'react-native-worklets/plugin',
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './theme/tamagui.config.ts',
          logTimings: false,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
    ],
  };
};
