import { configureStore } from "@reduxjs/toolkit";
import { fetchCategoriesAsync } from "../category.thunk";
import * as firebaseUtils from "../../../utils/firebase/firebase.utils";

jest.mock("../../../utils/firebase/firebase.utils", () => ({
  getCategoriesAndDocuments: jest.fn(),
}));

describe("fetchCategoriesAsync thunk", () => {
  it("should return categories on success", async () => {
    const mockCategories = [{ title: "Hats", items: [] }];

    (firebaseUtils.getCategoriesAndDocuments as jest.Mock).mockResolvedValue(
      mockCategories,
    );

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    const result = await store.dispatch(fetchCategoriesAsync());

    expect(result.type).toBe("category/fetchCategories/fulfilled");
    expect(result.payload).toEqual(mockCategories);
  });

  it("should handle rejection", async () => {
    (firebaseUtils.getCategoriesAndDocuments as jest.Mock).mockRejectedValue(
      new Error("Firebase error"),
    );

    const store = configureStore({
      reducer: (state = {}) => state,
    });

    const result = await store.dispatch(fetchCategoriesAsync());

    expect(result.type).toBe("category/fetchCategories/rejected");
  });
});
