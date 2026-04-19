import { User } from "firebase/auth";

export interface UserState {
  currentUser: User | null;
}
