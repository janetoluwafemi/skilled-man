const { getDefaultConfig } = require('expo/metro-config');
const metroResolver = require('metro-resolver');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Stub missing packages and native-only modules
  if (
    moduleName === 'normalize-css-color' ||
    (platform === 'web' &&
      (moduleName === 'react-native-maps' ||
        moduleName.startsWith('react-native-maps/')))
  ) {
    return { type: 'empty' };
  }

  // Standard Metro resolution
  return metroResolver.resolve(context, moduleName, platform);
};

module.exports = config;