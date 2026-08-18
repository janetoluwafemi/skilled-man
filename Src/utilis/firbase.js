import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebase-config';

export const signInWGoogle = async idToken => {
  try {
    if (!idToken) {
      throw new Error('No ID token obtained from Google authentication');
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);

    return userCredential.user;
  } catch (error) {
    console.log('Google Sign In Error:', error);
    return null;
  }
};
