import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { UserState } from "../../models/user.model";
import { USER_ACTION_TYPES } from "./user.types";
import {
  checkUserSession,
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutSuccess,
  signUpFailed,
  signUpSuccess,
} from "./user.actions";
import { stat } from "fs";

const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

export const userReducer = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession, (state) => {
        state.isLoading = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signInSuccess, (state, { payload }) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = null;
        state.currentUser = payload;
      })
      .addCase(signInFailed, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(signUpSuccess, (state, { payload }) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = null;
        state.currentUser = payload.user;
      })
      .addCase(signUpFailed, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(signOutSuccess, (state) => {
        state.currentUser = null;
        state.error = null;
      })
      .addCase(signOutFailed, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

const { reducer } = userReducer;
export { reducer as userReducers };
