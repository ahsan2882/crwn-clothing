import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { UserState } from "../../models/user.model";
import { USER_ACTION_TYPES } from "./user.types";

const INITIAL_STATE: UserState = { currentUser: null };

export const userReducer = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUser: (
      state: UserState,
      { payload }: { payload: { type: string; user: User | null } },
    ): UserState => {
      const { type, user } = payload;
      switch (type) {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
          return { ...state, currentUser: user };
        default:
          return state;
      }
    },
  },
});

export const { setCurrentUser } = userReducer.actions;
const { reducer } = userReducer;
export { reducer as userReducers };
