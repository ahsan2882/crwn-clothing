import { User } from "firebase/auth";

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
}

export interface SignInWithEmailInputs {
  email: string;
  password: string;
}
