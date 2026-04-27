import { createAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import {
  SignInWithEmailInputs,
  SignUpInputs,
  SignUpSuccessPayload,
} from "../../models/user.model";

export const checkUserSession = createAction("user/CHECK_USER_SESSION");

export const googleSignInStart = createAction("user/GOOGLE_SIGN_IN_START");

export const emailSignInStart = createAction<SignInWithEmailInputs>(
  "user/EMAIL_SIGN_IN_START",
);

export const signInSuccess = createAction<User>("user/SIGN_IN_SUCCESS");

export const signInFailed = createAction<string>("user/SIGN_IN_FAILED");

export const signUpStart = createAction<SignUpInputs>("user/SIGN_UP_START");

export const signUpSuccess = createAction<SignUpSuccessPayload>(
  "user/SIGN_UP_SUCCESS",
);

export const signUpFailed = createAction<string>("user/SIGN_UP_FAILED");

export const signOutStart = createAction("user/SIGN_OUT_START");

export const signOutSuccess = createAction("user/SIGN_OUT_SUCCESS");

export const signOutFailed = createAction<string>("user/SIGN_OUT_FAILED");
