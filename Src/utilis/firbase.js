import { Platform } from 'react-native';

const getGoogleAuthModules = () => {
  if (Platform.OS === 'web') return null;

  try {
    return {
      GoogleSignin: require('@react-native-google-signin/google-signin').GoogleSignin,
      auth: require('@react-native-firebase/auth').default,
    };
  } catch (error) {
    console.log('Native Google Sign-In is unavailable in this runtime.');
    return null;
  }
};

export const signInWGoogle = async (webClientId = 'YOUR_WEB_CLIENT_ID') => {
  try {
    const modules = getGoogleAuthModules();
    if (!modules) return null;

    const { GoogleSignin, auth } = modules;
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
      scopes: ['profile', 'email'],
    });

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken || signInResult.idToken;

    if (!idToken) {
      throw new Error('No ID token obtained from Google Sign In');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);

    return userCredential.user;
  } catch (error) {
    console.log('Google Sign In Error:', error);
    return null;
  }
};
