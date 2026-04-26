import { eventChannel } from "redux-saga";
import { createAuthChannel } from "../user.saga";
import * as firebase from "../../../utils/firebase/firebase.utils";
import { signInSuccess, signOutSuccess } from "../user.actions";
import { User } from "firebase/auth";

jest.mock("redux-saga", () => ({
  eventChannel: jest.fn(),
}));

jest.mock("../../../utils/firebase/firebase.utils", () => ({
  onAuthStateChangedListener: jest.fn(),
}));

describe("user saga auth channel", () => {
  it("should emit signInSuccess when user exists", () => {
    const emitMock = jest.fn();
    const unsubscribeMock = jest.fn();
    (firebase.onAuthStateChangedListener as jest.Mock).mockImplementation(
      (callback) => {
        callback({ uid: "1", email: "test@test.com" });
        return unsubscribeMock;
      },
    );
    (eventChannel as jest.Mock).mockImplementation((cb) => {
      cb(emitMock);
      return {};
    });
    createAuthChannel();
    expect(emitMock).toHaveBeenCalledWith(
      signInSuccess({ uid: "1", email: "test@test.com" } as User),
    );
  });

  it("should emit signOutSuccess when user is null", () => {
    const emitMock = jest.fn();
    (firebase.onAuthStateChangedListener as jest.Mock).mockImplementation(
      (callback) => {
        callback(null);
        return jest.fn();
      },
    );
    (eventChannel as jest.Mock).mockImplementation((cb) => {
      cb(emitMock);
      return {};
    });
    createAuthChannel();
    expect(emitMock).toHaveBeenCalledWith(signOutSuccess());
  });
});
