import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from "../category.actions";

describe("category actions", () => {
  it("creates fetchCategoriesStart action", () => {
    expect(fetchCategoriesStart()).toEqual({
      type: "category/fetchCategoriesStart",
    });
  });

  it("creates fetchCategoriesSuccess action", () => {
    const payload = [
      {
        title: "Hats",
        items: [],
      },
    ];

    expect(fetchCategoriesSuccess(payload)).toEqual({
      type: "category/fetchCategoriesSuccess",
      payload,
    });
  });

  it("creates fetchCategoriesFailure action", () => {
    const error = "Something went wrong";

    expect(fetchCategoriesFailure(error)).toEqual({
      type: "category/fetchCategoriesFailure",
      payload: error,
    });
  });
});
