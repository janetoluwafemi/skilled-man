import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const signInWGoogle = async () => {
  try {
    // Configure Google Sign In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual web client ID
      offlineAccess: false,
      scopes: ['profile', 'email'],
    });

    // Check if Play Services are available
    await GoogleSignin.hasPlayServices();

    // Sign in with Google
    const {idToken, user} = await GoogleSignin.signIn();

    // Get Google credentials
    const googleCredentials = auth.GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with Google credentials
    await auth().signInWithCredential(googleCredentials);

    // Return user information
    return user;
  } catch (error) {
    console.log('Google Sign In Error:', error);
    return null;
  }
};
