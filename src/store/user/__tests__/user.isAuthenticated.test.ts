import { runSaga, stdChannel, END, eventChannel } from "redux-saga";
import * as saga from "../user.saga";
import { signInSuccess, signOutSuccess, signInFailed } from "../user.actions";
import { User } from "firebase/auth";
import * as userSaga from "../user.saga";

const mockUser = { uid: "test-uid", email: "test@test.com" } as User;

/** Minimal EventChannel mock */
function makeMockChannel() {
  return { close: jest.fn() };
}

describe("user saga isAuthenticated", () => {
  it("should handle signInSuccess from channel", async () => {
    const fakeChannel = {
      close: jest.fn(),
    };
    const mockAction = signInSuccess({ uid: "1" } as any);
    jest.spyOn(saga, "createAuthChannel").mockReturnValue(fakeChannel as any);
    const gen = saga.isUserAuthenticated();
    // 1. call createAuthChannel
    gen.next();
    // 2. take action
    gen.next(mockAction);
    expect(fakeChannel.close).not.toHaveBeenCalled();
  });
});

describe("isUserAuthenticated", () => {
  // -------------------------------------------------------------------------
  // 1. Channel creation
  // -------------------------------------------------------------------------
  it("calls createAuthChannel on startup", () => {
    const gen = userSaga.isUserAuthenticated();

    // First yield: call(createAuthChannel)
    const firstYield = gen.next().value as any;

    expect(firstYield.type).toBe("CALL");
    expect(firstYield.payload.fn.name).toBe("createAuthChannel");
  });

  // -------------------------------------------------------------------------
  // 2. signInSuccess from channel → calls getSnapshotFromUserAuth
  // -------------------------------------------------------------------------
  it("calls getSnapshotFromUserAuth when channel emits signInSuccess", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    // Step 1: call(createAuthChannel) — inject mock channel
    gen.next(); // advance to first yield
    gen.next(mockChannel as any); // inject channel, advance to take()

    // Step 2: take(authChannel) — inject a signInSuccess action
    const signInAction = signInSuccess(mockUser);
    const afterTake = gen.next(signInAction).value as any;

    // Should now yield call(getSnapshotFromUserAuth, mockUser)
    expect(afterTake.type).toBe("CALL");
    expect(afterTake.payload.fn).toBe(userSaga.getSnapshotFromUserAuth);
    expect(afterTake.payload.args[0]).toEqual(mockUser);
  });

  it("does NOT put signOutSuccess when channel emits signInSuccess", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any);

    const signInAction = signInSuccess(mockUser);
    const afterTake = gen.next(signInAction).value as any;

    // Next effect must be the getSnapshotFromUserAuth CALL, not a PUT
    expect(afterTake.type).toBe("CALL");
    expect(afterTake.payload.fn).not.toBe(signOutSuccess);
  });

  // -------------------------------------------------------------------------
  // 3. signOutSuccess from channel → puts signOutSuccess()
  // -------------------------------------------------------------------------
  it("puts signOutSuccess when channel emits signOutSuccess", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any);

    const signOutAction = signOutSuccess();
    const afterTake = gen.next(signOutAction).value as any;

    // Should yield put(signOutSuccess())
    expect(afterTake.type).toBe("PUT");
    expect(afterTake.payload.action).toEqual(signOutSuccess());
  });

  it("does NOT call getSnapshotFromUserAuth when channel emits signOutSuccess", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any);

    const signOutAction = signOutSuccess();
    const afterTake = gen.next(signOutAction).value as any;

    // A PUT means getSnapshotFromUserAuth was never called — assert both directly
    expect(afterTake.type).toBe("PUT");
    expect(afterTake.payload.action).toEqual(signOutSuccess());
  });

  // -------------------------------------------------------------------------
  // 4. Inner error handling — Error instance
  // -------------------------------------------------------------------------
  it("puts signInFailed with error.message when inner try throws an Error", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any); // inject channel → lands on take()

    // Simulate take() returning signInSuccess so we enter the signIn branch
    gen.next(signInSuccess(mockUser)); // → lands on call(getSnapshotFromUserAuth)

    // Now throw an error into the saga (simulates getSnapshotFromUserAuth throwing)
    const error = new Error("Firestore unavailable");
    const afterThrow = gen.throw(error).value as any;

    expect(afterThrow.type).toBe("PUT");
    expect(afterThrow.payload.action).toEqual(
      signInFailed("Firestore unavailable"),
    );
  });

  // -------------------------------------------------------------------------
  // 5. Inner error handling — non-Error throw (fallback message)
  // -------------------------------------------------------------------------
  it("puts signInFailed with fallback message for non-Error throws", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any);
    gen.next(signInSuccess(mockUser)); // → call(getSnapshotFromUserAuth)

    const afterThrow = gen.throw("some string error").value as any;

    expect(afterThrow.type).toBe("PUT");
    expect(afterThrow.payload.action).toEqual(
      signInFailed("Failed to authenticate user"),
    );
  });

  // -------------------------------------------------------------------------
  // 6. Finally block — channel.close() is called on termination
  // -------------------------------------------------------------------------
  it("closes the channel in the finally block when the saga is terminated", () => {
    const gen = userSaga.isUserAuthenticated();
    const mockChannel = makeMockChannel();

    gen.next();
    gen.next(mockChannel as any); // inject channel

    // Force-return (simulates task cancellation triggering finally)
    gen.return(undefined);

    expect(mockChannel.close).toHaveBeenCalledTimes(1);
  });
});
