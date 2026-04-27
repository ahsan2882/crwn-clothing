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
} from "../user.actions";
import { userReducers } from "../user.reducer";

describe("user reducer", () => {
  const initialState = {
    currentUser: null,
    isLoading: false,
    hasLoaded: false,
    error: null,
  };

  it("should return initial state", () => {
    expect(userReducers(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("should handle checkUserSession", () => {
    const state = userReducers(initialState, checkUserSession());

    expect(state).toEqual({
      currentUser: null,
      isLoading: true,
      hasLoaded: false,
      error: null,
    });
  });

  it("should handle signInSuccess", () => {
    const mockUser = { uid: "1", email: "test@test.com" } as any;

    const state = userReducers(
      { ...initialState, isLoading: true },
      signInSuccess(mockUser),
    );

    expect(state).toEqual({
      currentUser: mockUser,
      isLoading: false,
      hasLoaded: true,
      error: null,
    });
  });

  it("should handle signInFailed", () => {
    const state = userReducers(
      { ...initialState, isLoading: true },
      signInFailed("Login failed"),
    );

    expect(state).toEqual({
      currentUser: null,
      isLoading: false,
      hasLoaded: false,
      error: "Login failed",
    });
  });

  it("should handle signUpFailed", () => {
    const state = userReducers(
      { ...initialState, isLoading: true },
      signUpFailed("Sign up failed"),
    );

    expect(state).toEqual({
      currentUser: null,

      isLoading: false,
      hasLoaded: false,
      error: "Sign up failed",
    });
  });

  it("should handle signOutSuccess", () => {
    const state = userReducers(
      {
        ...initialState,
        currentUser: { uid: "1" } as any,
        isLoading: true,
      },
      signOutSuccess(),
    );

    expect(state).toEqual({
      currentUser: null,
      isLoading: false,
      hasLoaded: true,
      error: null,
    });
  });

  it("should handle signOutFailed", () => {
    const state = userReducers(
      { ...initialState, isLoading: true },
      signOutFailed("Sign out error"),
    );

    expect(state).toEqual({
      currentUser: null,
      isLoading: false,
      hasLoaded: true,
      error: "Sign out error",
    });
  });

  it("should handle googleSignInStart", () => {
    const state = userReducers(initialState, googleSignInStart());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle emailSignInStart", () => {
    const state = userReducers(
      initialState,
      emailSignInStart({
        email: "test@test.com",
        password: "123",
      }),
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle signUpStart", () => {
    const state = userReducers(
      initialState,
      signUpStart({
        email: "test@test.com",
        password: "123",
        displayName: "Test",
      }),
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle signOutStart", () => {
    const state = userReducers(
      { ...initialState, currentUser: { uid: "1" } as any },
      signOutStart(),
    );

    expect(state.isLoading).toBe(true);
    expect(state.hasLoaded).toBe(false);
    expect(state.error).toBe(null);
  });
});
