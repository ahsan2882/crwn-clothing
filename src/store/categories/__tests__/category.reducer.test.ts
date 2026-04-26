import { categoryReducers } from "../category.reducer";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from "../category.actions";

describe("category reducer", () => {
  const initialState = {
    categories: [],
    isLoading: false,
    error: null,
    hasLoaded: false,
  };

  it("should return initial state", () => {
    expect(categoryReducers(undefined, { type: "UNKNOWN" })).toEqual(
      initialState,
    );
  });

  it("should handle fetchCategoriesStart", () => {
    const state = categoryReducers(initialState, fetchCategoriesStart());

    expect(state).toEqual({
      categories: [],
      isLoading: true,
      error: null,
      hasLoaded: false,
    });
  });

  it("should handle fetchCategoriesSuccess", () => {
    const mockCategories = [
      {
        title: "Hats",
        items: [],
      },
    ];

    const state = categoryReducers(
      {
        ...initialState,
        isLoading: true,
      },
      fetchCategoriesSuccess(mockCategories),
    );

    expect(state).toEqual({
      categories: mockCategories,
      isLoading: false,
      error: null,
      hasLoaded: true,
    });
  });

  it("should handle fetchCategoriesFailure", () => {
    const state = categoryReducers(
      {
        ...initialState,
        isLoading: true,
      },
      fetchCategoriesFailure("Error occurred"),
    );

    expect(state).toEqual({
      categories: [],
      isLoading: false,
      error: "Error occurred",
      hasLoaded: false,
    });
  });
});
