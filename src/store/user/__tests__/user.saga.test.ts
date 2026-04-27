import { runSaga } from "redux-saga";
import * as firebase from "../../../utils/firebase/firebase.utils";
import * as userSaga from "../user.saga";

import { User } from "firebase/auth";
import {
  checkUserSession,
  emailSignInStart,
  googleSignInStart,
  signInFailed,
  signInSuccess,
  signOutStart,
  signOutSuccess,
  signUpStart,
  signUpSuccess,
} from "../user.actions";

jest.mock("../../../utils/firebase/firebase.utils");

describe("user saga", () => {
  it("signInWithGoogle → success", async () => {
    const mockUser = { user: { uid: "1", email: "test@test.com" } as User };
    (firebase.signInWithGooglePopup as jest.Mock).mockResolvedValue(mockUser);
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      userSaga.signInWithGoogle,
    ).toPromise();
    expect(dispatched).toContainEqual(signInSuccess(mockUser.user));
  });

  it("signInWithGoogle → failure", async () => {
    (firebase.signInWithGooglePopup as jest.Mock).mockRejectedValue(
      new Error("Google error"),
    );
    const dispatched: any[] = [];
    await runSaga(
      { dispatch: (a) => dispatched.push(a) },
      userSaga.signInWithGoogle,
    ).toPromise();
    expect(dispatched[0].type).toBe("user/SIGN_IN_FAILED");
  });

  it("signInWithEmail → success", async () => {
    const mockUser = { user: { uid: "1" } as User };
    (
      firebase.signInAuthUserWithEmailAndPassword as jest.Mock
    ).mockResolvedValue(mockUser);
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (a) => dispatched.push(a),
      },
      userSaga.signInWithEmail,
      {
        payload: { email: "a@a.com", password: "123" },
      } as any,
    ).toPromise();
    expect(dispatched).toContainEqual(signInSuccess(mockUser.user));
  });

  it("signInWithEmail → failure", async () => {
    (
      firebase.signInAuthUserWithEmailAndPassword as jest.Mock
    ).mockRejectedValue(new Error("Auth error"));
    const dispatched: any[] = [];
    await runSaga(
      { dispatch: (a) => dispatched.push(a) },
      userSaga.signInWithEmail,
      {
        payload: { email: "a@a.com", password: "123" },
      } as any,
    ).toPromise();
    expect(dispatched[0].type).toBe("user/SIGN_IN_FAILED");
  });

  it("signUp → success", async () => {
    const mockUser = { user: { uid: "1" } as User };
    (
      firebase.createAuthUserWithEmailAndPassword as jest.Mock
    ).mockResolvedValue(mockUser);
    const dispatched: any[] = [];
    await runSaga({ dispatch: (a) => dispatched.push(a) }, userSaga.signUp, {
      payload: {
        email: "a@a.com",
        password: "123",
        displayName: "Test",
      },
    } as any).toPromise();
    expect(dispatched).toContainEqual(
      signUpSuccess({
        user: mockUser.user,
        additionalInformation: { displayName: "Test" },
      }),
    );
  });

  it("signUp → failure", async () => {
    (
      firebase.createAuthUserWithEmailAndPassword as jest.Mock
    ).mockRejectedValue(new Error("Signup error"));
    const dispatched: any[] = [];
    await runSaga({ dispatch: (a) => dispatched.push(a) }, userSaga.signUp, {
      payload: {
        email: "a@a.com",
        password: "123",
        displayName: "Test",
      },
    } as any).toPromise();
    expect(dispatched[0].type).toBe("user/SIGN_UP_FAILED");
  });

  it("signOut → success", async () => {
    (firebase.signOutUser as jest.Mock).mockResolvedValue(undefined);
    const dispatched: any[] = [];
    await runSaga(
      { dispatch: (a) => dispatched.push(a) },
      userSaga.signOut,
    ).toPromise();
    expect(dispatched).toContainEqual(signOutSuccess());
  });

  it("signOut → failure", async () => {
    (firebase.signOutUser as jest.Mock).mockRejectedValue(
      new Error("Signout error"),
    );
    const dispatched: any[] = [];
    await runSaga(
      { dispatch: (a) => dispatched.push(a) },
      userSaga.signOut,
    ).toPromise();
    expect(dispatched[0].type).toBe("user/SIGN_OUT_FAILED");
  });

  it("getSnapshotFromUserAuth → success", async () => {
    (firebase.createUserDocumentFromAuth as jest.Mock).mockResolvedValue(
      undefined,
    );
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (a) => dispatched.push(a),
      },
      userSaga.getSnapshotFromUserAuth,
      { uid: "1" } as any,
    ).toPromise();
    expect(dispatched).toContainEqual(signInSuccess({ uid: "1" } as any));
  });

  it("getSnapshotFromUserAuth → failure fallback message", async () => {
    (firebase.createUserDocumentFromAuth as jest.Mock).mockRejectedValue(
      new Error("firestore failed"),
    );
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (a) => dispatched.push(a),
      },
      userSaga.getSnapshotFromUserAuth,
      { uid: "1" } as any,
    ).toPromise();
    expect(dispatched).toContainEqual(signInFailed("firestore failed"));
  });

  it("signInAfterSignUp → success", async () => {
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (a) => dispatched.push(a),
      },
      userSaga.signInAfterSignUp,
      {
        payload: {
          user: { uid: "1" },
          additionalInformation: { displayName: "Test" },
        },
      } as any,
    ).toPromise();
    expect(dispatched).toContainEqual(signInSuccess({ uid: "1" } as any));
  });

  it("signInAfterSignUp → error fallback message", async () => {
    // force getSnapshotFromUserAuth dependency to throw
    (firebase.createUserDocumentFromAuth as jest.Mock).mockRejectedValue(
      new Error("snapshot failed"),
    );
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (a) => dispatched.push(a),
      },
      userSaga.signInAfterSignUp,
      {
        payload: {
          user: { uid: "1" },
          additionalInformation: {},
        },
      } as any,
    ).toPromise();
    expect(dispatched).toContainEqual(signInFailed("snapshot failed"));
  });

  it("watches google sign in", () => {
    const gen = userSaga.onGoogleSignInStart();
    const effect = gen.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.args[0]).toBe(googleSignInStart);
    expect(effect.payload.args[1]).toBe(userSaga.signInWithGoogle);
  });

  describe("signInAfterSignUp", () => {
    it("covers fallback error branch", () => {
      const gen = userSaga.signInAfterSignUp({
        type: "user/SIGN_UP_SUCCESS",
        payload: {
          user: { uid: "1" },
          additionalInformation: { displayName: "Test" },
        },
      } as any);

      gen.next(); // run first yield (call)

      const result = gen.throw("UNKNOWN_ERROR");

      expect(result.value).toEqual(
        expect.objectContaining({
          type: "PUT",
          payload: expect.objectContaining({
            action: {
              type: "user/SIGN_IN_FAILED",
              payload: "Sign in after sign up failed",
            },
          }),
        }),
      );
    });
  });
});

describe("onEmailSignInStart watcher", () => {
  it("should watch emailSignInStart and trigger signInWithEmail", () => {
    const gen = userSaga.onEmailSignInStart();
    const effect = gen.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.fn).toBeDefined();
    expect(effect.payload.args[0]).toBe(emailSignInStart);
    expect(effect.payload.args[1]).toBe(userSaga.signInWithEmail);
  });
});

describe("onSignUpStart watcher", () => {
  it("should listen for signUpStart and call signUp saga", () => {
    const generator = userSaga.onSignUpStart();
    const effect = generator.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.fn).toBeDefined();
    expect(effect.payload.args[0]).toBe(signUpStart);
    expect(effect.payload.args[1]).toBe(userSaga.signUp);
  });
});

describe("onSignUpSuccess watcher", () => {
  it("should listen for signUpSuccess and call signInAfterSignUp", () => {
    const generator = userSaga.onSignUpSuccess();
    const effect = generator.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.fn).toBeDefined();
    expect(effect.payload.args[0]).toBe(signUpSuccess);
    expect(effect.payload.args[1]).toBe(userSaga.signInAfterSignUp);
  });
});

describe("onSignOutStart watcher", () => {
  it("should listen for signOutStart and call signOut saga", () => {
    const generator = userSaga.onSignOutStart();
    const effect = generator.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.fn).toBeDefined();
    expect(effect.payload.args[0]).toBe(signOutStart);
    expect(effect.payload.args[1]).toBe(userSaga.signOut);
  });
});

describe("onCheckUserSession saga", () => {
  it("should watch checkUserSession and trigger isUserAuthenticated", () => {
    const generator = userSaga.onCheckUserSession();
    const effect = generator.next().value as any;
    expect(effect.type).toBe("FORK");
    expect(effect.payload.fn).toBeDefined();
    expect(effect.payload.args[0]).toBe(checkUserSession);
    expect(effect.payload.args[1]).toBe(userSaga.isUserAuthenticated);
  });
});

describe("userSagas root", () => {
  it("should initialize all watchers in parallel", () => {
    const gen = userSaga.userSagas();
    const effect = gen.next().value as any;
    // 1. confirm ALL combinator
    expect(effect.type).toBe("ALL");
    // 2. confirm correct number of watchers
    expect(effect.payload).toHaveLength(6);
  });
});
