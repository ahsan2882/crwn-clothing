import {
  addCollectionAndDocuments,
  auth,
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  getCategoriesAndDocuments,
  getCurrentUser,
  onAuthStateChangedListener,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from "../firebase.utils";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn(),
  })),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  writeBatch: jest.fn(),
}));

describe("Auth utilities", () => {
  it("should reject if email/password missing on sign up", async () => {
    await expect(createAuthUserWithEmailAndPassword("", "")).rejects.toThrow(
      "Email and password are required",
    );
  });

  it("should call Firebase sign up when valid input", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue("user");
    const result = await createAuthUserWithEmailAndPassword(
      "test@test.com",
      "123456",
    );
    expect(result).toBe("user");
  });

  it("should reject if email/password missing on sign in", async () => {
    await expect(signInAuthUserWithEmailAndPassword("", "")).rejects.toThrow(
      "Email and password are required",
    );
  });

  it("should call Firebase sign in when valid input", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue("user");
    const result = await signInAuthUserWithEmailAndPassword(
      "test@test.com",
      "123456",
    );
    expect(result).toBe("user");
  });
});

describe("Firestore category fetch", () => {
  it("should map firestore docs to product collections", async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        {
          data: () => ({
            title: "Hats",
            items: [],
          }),
        },
      ],
    });
    const result = await getCategoriesAndDocuments("categories");
    expect(result).toEqual([
      {
        title: "Hats",
        items: [],
      },
    ]);
  });
});

describe("Google sign-in popup", () => {
  it("should call signInWithPopup with auth and provider", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: { uid: "123" },
    });
    await signInWithGooglePopup();
    expect(signInWithPopup).toHaveBeenCalledWith(
      auth,
      expect.any(Object), // googleProvider instance
    );
  });
});

describe("addCollectionAndDocuments", () => {
  const mockSet = jest.fn();
  const mockCommit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (writeBatch as jest.Mock).mockReturnValue({
      set: mockSet,
      commit: mockCommit,
    });
    (collection as jest.Mock).mockReturnValue("collectionRef");
    (doc as jest.Mock).mockImplementation((ref, id) => ({
      ref,
      id,
    }));
  });

  it("should create batch writes for each object", async () => {
    const objects = [
      { title: "Hats", price: 10 },
      { title: "Jackets", price: 20 },
    ];
    await addCollectionAndDocuments("categories", objects);
    // collection called once
    expect(collection).toHaveBeenCalledWith(expect.anything(), "categories");
    // doc called for each item
    expect(doc).toHaveBeenCalledTimes(2);
    expect(doc).toHaveBeenCalledWith("collectionRef", "hats");
    expect(doc).toHaveBeenCalledWith("collectionRef", "jackets");
    // batch operations
    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("should handle empty array safely", async () => {
    await addCollectionAndDocuments("categories", []);
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });
});

describe("createUserDocumentFromAuth", () => {
  const mockUserAuth = {
    uid: "123",
    displayName: "John",
    email: "john@test.com",
  } as any;

  const mockDocRef = { id: "docRef" };

  beforeEach(() => {
    jest.clearAllMocks();
    (doc as jest.Mock).mockReturnValue(mockDocRef);
  });

  it("should reject if userAuth is missing", async () => {
    await expect(createUserDocumentFromAuth(null as any)).rejects.toThrow(
      "Missing authenticated user",
    );
  });

  it("should return existing user document if exists", async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockUserAuth,
    });
    const result = await createUserDocumentFromAuth(mockUserAuth);
    expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    expect(setDoc).not.toHaveBeenCalled();
    expect(result.exists()).toBe(true);
  });

  it("should create user document if it does not exist", async () => {
    const firstSnapshot = {
      exists: () => false,
    };
    const secondSnapshot = {
      exists: () => true,
      data: () => mockUserAuth,
    };
    (getDoc as jest.Mock)
      .mockResolvedValueOnce(firstSnapshot)
      .mockResolvedValueOnce(secondSnapshot);
    (setDoc as jest.Mock).mockResolvedValue(undefined);
    const result = await createUserDocumentFromAuth(mockUserAuth, {
      role: "user",
    });
    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        displayName: "John",
        email: "john@test.com",
        role: "user",
      }),
    );
    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(result.exists()).toBe(true);
  });

  it("should throw error if setDoc fails", async () => {
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });
    (setDoc as jest.Mock).mockRejectedValue(new Error("Firestore error"));
    await expect(createUserDocumentFromAuth(mockUserAuth)).rejects.toThrow(
      "Firestore error",
    );
    expect(setDoc).toHaveBeenCalled();
  });
});

describe("onAuthStateChangedListener", () => {
  it("should call onAuthStateChanged with auth and callback", () => {
    const mockCallback = jest.fn();
    onAuthStateChangedListener(mockCallback);
    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, mockCallback);
  });
});

describe("getCurrentUser", () => {
  it("should resolve with userAuth", async () => {
    let successCallback: any;
    const unsubscribeMock = jest.fn();

    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      successCallback = cb;
      return unsubscribeMock;
    });

    const promise = getCurrentUser();

    successCallback({ uid: "123" });

    const result = await promise;

    expect(result).toEqual({ uid: "123" });
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it("should reject on error", async () => {
    const unsubscribeMock = jest.fn();
    const error = new Error("Auth failed");

    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth, _successCallback, errorCallback) => {
        Promise.resolve().then(() => {
          errorCallback(error); // ✅ ONLY error path
        });

        return unsubscribeMock;
      },
    );

    await expect(getCurrentUser()).rejects.toThrow("Auth failed");

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
