const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const currentPlatform = platform || context.platform || 'web';

  if (
    moduleName === 'normalize-css-color' ||
    (currentPlatform === 'web' &&
      (moduleName === 'react-native-maps' ||
        moduleName.startsWith('react-native-maps/')))
  ) {
    return { type: 'empty' };
  }

  return context.resolveRequest
    ? context.resolveRequest(context, moduleName, currentPlatform)
    : context.resolve(context, moduleName, currentPlatform);
};

module.exports = config;