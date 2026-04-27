import { User } from "firebase/auth";
import { AsyncSliceState } from "./async-state.model";

export interface UserState extends AsyncSliceState {
  currentUser: User | null;
}

export interface SignInWithEmailInputs {
  email: string;
  password: string;
}

export interface SignUpInputs {
  email: string;
  password: string;
  displayName: string;
}

export interface SignUpSuccessPayload {
  user: User;
  additionalInformation: Record<string, unknown>;
}
