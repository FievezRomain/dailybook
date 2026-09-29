const { getDefaultConfig } = require('@expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './theme/tamagui.config.ts',
});
