const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Save Expo's default resolver logic
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Stub out native-only modules on Web
    if (
        platform === 'web' &&
        (moduleName === 'react-native-simple-toast' ||
            moduleName === '@react-native-google-signin/google-signin' ||
            moduleName === 'react-native-maps' ||
            moduleName.startsWith('react-native-maps/'))
    ) {
        return { type: 'empty' };
    }

    // Fallback to Expo's standard resolution
    if (defaultResolveRequest) {
        return defaultResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;