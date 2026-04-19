import { UserState } from "../../models/user.model";

export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
