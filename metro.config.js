// const { getDefaultConfig } = require('expo/metro-config');
// const metroResolver = require('metro-resolver');
//
// const config = getDefaultConfig(__dirname);
//
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (
//     moduleName === 'normalize-css-color' ||
//     (platform === 'web' &&
//       (moduleName === 'react-native-maps' ||
//         moduleName.startsWith('react-native-maps/')))
//   ) {
//     return { type: 'empty' };
//   }
//
//   return metroResolver.resolve(context, moduleName, platform);
// };
//
// module.exports = config;



// const { getDefaultConfig } = require('expo/metro-config');
// const metroResolver = require('metro-resolver');
//
// const config = getDefaultConfig(__dirname);
//
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   // Ensure platform always falls back to context.platform or 'web'
//   const resolvedPlatform = platform || context.platform || 'web';
//
//   // Stub missing web packages and native-only modules
//   if (
//       moduleName === 'normalize-css-color' ||
//       (resolvedPlatform === 'web' &&
//           (moduleName === 'react-native-maps' ||
//               moduleName.startsWith('react-native-maps/')))
//   ) {
//     return { type: 'empty' };
//   }
//
//   // Pass guaranteed platform context to Metro's resolver
//   return metroResolver.resolve(
//       {
//         ...context,
//         platform: resolvedPlatform,
//       },
//       moduleName,
//       resolvedPlatform
//   );
// };
//
// module.exports = config;



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