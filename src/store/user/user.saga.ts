import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  getCurrentUser,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  signOutUser,
} from "../../utils/firebase/firebase.utils";
import { User, UserCredential } from "firebase/auth";
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
  signUpSuccess,
} from "./user.actions";

type EmailSignInAction = ReturnType<typeof emailSignInStart>;
type SignupAction = ReturnType<typeof signUpStart>;
type SignInAfterSignUpAction = ReturnType<typeof signUpSuccess>;

export function* signInWithGoogle() {
  try {
    const userCred: UserCredential = yield call(signInWithGooglePopup);
    const { user } = userCred;
    yield call(getSnapshotFromUserAuth, user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign in with google";
    yield put(signInFailed(message));
  }
}

export function* signInWithEmail({ payload }: EmailSignInAction) {
  try {
    const { email, password } = payload;
    const userCred: UserCredential = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password,
    );
    const { user } = userCred;
    yield call(getSnapshotFromUserAuth, user);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to sign in with email/password";
    yield put(signInFailed(message));
  }
}

export function* signUp({ payload }: SignupAction) {
  try {
    const { email, password, displayName } = payload;
    const userCred: UserCredential = yield call(
      createAuthUserWithEmailAndPassword,
      email,
      password,
    );
    const { user } = userCred;
    yield put(signUpSuccess({ user, additionalInformation: { displayName } }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed";
    yield put(signUpFailed(message));
  }
}

export function* signInAfterSignUp({ payload }: SignInAfterSignUpAction) {
  try {
    const { user, additionalInformation } = payload;
    yield call(getSnapshotFromUserAuth, user, additionalInformation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign up failed";
    yield put(signUpFailed(message));
  }
}

export function* signOut() {
  try {
    yield call(signOutUser);
    yield put(signOutSuccess);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign out failed";
    yield put(signOutFailed(message));
  }
}

export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalInformation: Record<string, any> = {},
) {
  try {
    yield call(createUserDocumentFromAuth, userAuth, additionalInformation);
    yield put(signInSuccess(userAuth));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch userSnapshot";
    yield put(signInFailed(message));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth: User | null = yield call(getCurrentUser);
    if (userAuth) {
      yield call(getSnapshotFromUserAuth, userAuth);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to authenticate user";
    yield put(signInFailed(message));
  }
}

export function* onCheckUserSession() {
  yield takeLatest(checkUserSession, isUserAuthenticated);
}

export function* onGoogleSignInStart() {
  yield takeLatest(googleSignInStart, signInWithGoogle);
}

export function* onEmailSignInStart() {
  yield takeLatest(emailSignInStart, signInWithEmail);
}

export function* onSignUpStart() {
  yield takeLatest(signUpStart, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(signUpSuccess, signInAfterSignUp);
}

export function* onSignOutStart() {
  yield takeLatest(signOutStart, signOut);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onEmailSignInStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
    call(onSignOutStart),
  ]);
}
