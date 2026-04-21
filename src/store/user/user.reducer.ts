import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../../models/user.model";
import {
  checkUserSession,
  emailSignInStart,
  googleSignInStart,
  signInFailed,
  signInSuccess,
  signOutFailed,
  signOutStart,
  signOutSuccess,
  signUpFailed,
  signUpStart,
} from "./user.actions";

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
        state.hasLoaded = false;
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
        state.hasLoaded = false;
        state.error = payload;
      })
      .addCase(signUpFailed, (state, { payload }) => {
        state.isLoading = false;
        state.hasLoaded = false;
        state.error = payload;
      })
      .addCase(signOutSuccess, (state) => {
        state.currentUser = null;
        state.error = null;
        state.isLoading = false;
        state.hasLoaded = true;
      })
      .addCase(signOutFailed, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(googleSignInStart, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(emailSignInStart, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpStart, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOutStart, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

const { reducer } = userReducer;
export { reducer as userReducers };
