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
} from "../user.actions";

describe("user actions", () => {
  it("checkUserSession", () => {
    expect(checkUserSession()).toEqual({
      type: "user/CHECK_USER_SESSION",
    });
  });

  it("googleSignInStart", () => {
    expect(googleSignInStart()).toEqual({
      type: "user/GOOGLE_SIGN_IN_START",
    });
  });

  it("emailSignInStart", () => {
    const payload = {
      email: "test@test.com",
      password: "123456",
    };

    expect(emailSignInStart(payload)).toEqual({
      type: "user/EMAIL_SIGN_IN_START",
      payload,
    });
  });

  it("signInSuccess", () => {
    const payload = {
      uid: "123",
      email: "test@test.com",
    } as any;

    expect(signInSuccess(payload)).toEqual({
      type: "user/SIGN_IN_SUCCESS",
      payload,
    });
  });

  it("signInFailed", () => {
    expect(signInFailed("error")).toEqual({
      type: "user/SIGN_IN_FAILED",
      payload: "error",
    });
  });

  it("signUpStart", () => {
    const payload = {
      email: "test@test.com",
      password: "123456",
      displayName: "Test",
    };

    expect(signUpStart(payload)).toEqual({
      type: "user/SIGN_UP_START",
      payload,
    });
  });

  it("signUpSuccess", () => {
    const payload = {
      user: { uid: "1", email: "test@test.com" },
      additionalDetails: { displayName: "Test" },
    } as any;

    expect(signUpSuccess(payload)).toEqual({
      type: "user/SIGN_UP_SUCCESS",
      payload,
    });
  });

  it("signUpFailed", () => {
    expect(signUpFailed("failed")).toEqual({
      type: "user/SIGN_UP_FAILED",
      payload: "failed",
    });
  });

  it("signOutStart", () => {
    expect(signOutStart()).toEqual({
      type: "user/SIGN_OUT_START",
    });
  });

  it("signOutSuccess", () => {
    expect(signOutSuccess()).toEqual({
      type: "user/SIGN_OUT_SUCCESS",
    });
  });

  it("signOutFailed", () => {
    expect(signOutFailed("error")).toEqual({
      type: "user/SIGN_OUT_FAILED",
      payload: "error",
    });
  });
});
