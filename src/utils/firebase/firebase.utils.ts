import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getRequiredEnv } from "../secret.utils";
import { ProductCollection } from "../../models/product.model";

const firebaseConfig = {
  apiKey: getRequiredEnv(
    "REACT_APP_FIREBASE_API_KEY",
    process.env.REACT_APP_FIREBASE_API_KEY,
  ),
  authDomain: getRequiredEnv(
    "REACT_APP_AUTH_DOMAIN",
    process.env.REACT_APP_AUTH_DOMAIN,
  ),
  projectId: getRequiredEnv(
    "REACT_APP_PROJECT_ID",
    process.env.REACT_APP_PROJECT_ID,
  ),
  storageBucket: getRequiredEnv(
    "REACT_APP_STORAGE_BUCKET",
    process.env.REACT_APP_STORAGE_BUCKET,
  ),
  messagingSenderId: getRequiredEnv(
    "REACT_APP_MESSAGING_SENDER_ID",
    process.env.REACT_APP_MESSAGING_SENDER_ID,
  ),
  appId: getRequiredEnv("REACT_APP_APP_ID", process.env.REACT_APP_APP_ID),
  measurementId: getRequiredEnv(
    "REACT_APP_MEASUREMENT_ID",
    process.env.REACT_APP_MEASUREMENT_ID,
  ),
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

export type ObjectToAdd = {
  title: string;
};

export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
  collectionKey: string,
  objectsToAdd: T[],
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);
  objectsToAdd.forEach((object: T) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });
  await batch.commit();
};

export const getCategoriesAndDocuments = async (
  collectionKey: string,
): Promise<ProductCollection[]> => {
  const collectionRef = collection(db, collectionKey);
  const queryRef = query(collectionRef);
  const querySnapshot = await getDocs(queryRef);
  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as ProductCollection,
  );
};

export type UserData = {
  email: string;
  createdAt: Date;
  displayName: string;
};

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: Record<string, unknown> = {},
): Promise<QueryDocumentSnapshot<UserData>> => {
  if (userAuth) {
    const userDocRef = doc(db, "users", userAuth.uid);
    let userSnapshot = await getDoc(userDocRef);
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
        userSnapshot = await getDoc(userDocRef);
      } catch (error) {
        console.error("error creating the user", error);
        throw error;
      }
    }
    return userSnapshot as QueryDocumentSnapshot<UserData>;
  }
  return Promise.reject(new Error("Missing authenticated user"));
};

export const createAuthUserWithEmailAndPassword: (
  email: string,
  password: string,
) => Promise<UserCredential> = async (email: string, password: string) => {
  if (!email || !password) {
    return Promise.reject(new Error("Email and password are required"));
  }
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword: (
  email: string,
  password: string,
) => Promise<UserCredential> = async (email: string, password: string) => {
  if (!email || !password) {
    return Promise.reject(new Error("Email and password are required"));
  }
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void,
) => onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });
};
