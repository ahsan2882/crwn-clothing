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
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { ProductCollection } from "../../models/product.model";
import { getRequiredEnv } from "../secret.utils";

const firebaseConfig = {
  apiKey: getRequiredEnv(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: getRequiredEnv(process.env.REACT_APP_AUTH_DOMAIN),
  projectId: getRequiredEnv(process.env.REACT_APP_PROJECT_ID),
  storageBucket: getRequiredEnv(process.env.REACT_APP_STORAGE_BUCKET),
  messagingSenderId: getRequiredEnv(process.env.REACT_APP_MESSAGING_SENDER_ID),
  appId: getRequiredEnv(process.env.REACT_APP_APP_ID),
  measurementId: getRequiredEnv(process.env.REACT_APP_MEASUREMENT_ID),
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

export const addCollectionAndDocuments = async (
  collectionKey: string,
  objectsToAdd: ProductCollection[],
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);
  objectsToAdd.forEach((object: ProductCollection) => {
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

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: Record<string, any> = {},
): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
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
    return userSnapshot;
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
