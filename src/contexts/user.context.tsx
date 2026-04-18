import {
  createContext,
  // useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  // type Dispatch,
  // type SetStateAction,
  useReducer,
} from "react";
import type { User } from "firebase/auth";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "../utils/firebase/firebase.utils";

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

type UserState = Pick<UserContextType, "currentUser">;
type UserAction = {
  type: typeof USER_ACTION_TYPES.SET_CURRENT_USER;
  payload: User | null;
};

const defaultUserContext: UserContextType = {
  currentUser: null,
  setCurrentUser: () => null,
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
} as const;

const INITIAL_STATE = { currentUser: null };

const userReducer = (state: UserState, action: UserAction): UserState => {
  const { type, payload } = action;
  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return { ...state, currentUser: payload };

    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { currentUser } = state;
  const setCurrentUser = useCallback((user: User | null) => {
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user });
  }, []);
  const value = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser, setCurrentUser],
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user: User | null) => {
      if (user) {
        createUserDocumentFromAuth(user).catch((error) => {
          console.error("Failed to create/sync user document", error);
        });
      }
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [setCurrentUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
