import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  UserCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmZe14_k6m6yL9dCP-M2U39Taip7OJBC0",
  authDomain: "crwn-db-8f405.firebaseapp.com",
  projectId: "crwn-db-8f405",
  storageBucket: "crwn-db-8f405.firebasestorage.app",
  messagingSenderId: "250402705481",
  appId: "1:250402705481:web:07e6e11fae0163a7eeaf98",
  measurementId: "G-11VLQBTH3B",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: Record<string, any> = {},
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error);
    }
  }
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword: (
  email: string,
  password: string,
) => Promise<UserCredential | undefined> = async (
  email: string,
  password: string,
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword: (
  email: string,
  password: string,
) => Promise<UserCredential | undefined> = async (
  email: string,
  password: string,
) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};
