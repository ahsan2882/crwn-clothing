export const initializeApp = jest.fn();
export const getAuth = jest.fn(() => ({}));
export const getFirestore = jest.fn(() => ({}));

export const signInWithPopup = jest.fn();
export const signInWithRedirect = jest.fn();
export const signOut = jest.fn();

export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();

export const onAuthStateChanged = jest.fn();

export const collection = jest.fn();
export const doc = jest.fn();
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const writeBatch = jest.fn(() => ({
  set: jest.fn(),
  commit: jest.fn(),
}));
export const query = jest.fn();
