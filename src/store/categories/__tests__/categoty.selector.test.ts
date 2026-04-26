import {
  selectCategories,
  selectCategoriesMap,
  selectCategoriesIsLoading,
  selectCategoriesHasLoaded,
  selectCategoriesError,
} from "../category.selector";

describe("category selectors", () => {
  const mockState = {
    category: {
      categories: [
        {
          title: "Hats",
          items: [{ id: 1, name: "Beanie" }],
        },
        {
          title: " Jackets ",
          items: [{ id: 2, name: "Leather Jacket" }],
        },
      ],
      isLoading: true,
      hasLoaded: false,
      error: "Some error",
    },
  } as any;

  it("selectCategories should return categories array", () => {
    expect(selectCategories(mockState)).toEqual(mockState.category.categories);
  });

  it("selectCategoriesIsLoading should return loading state", () => {
    expect(selectCategoriesIsLoading(mockState)).toBe(true);
  });

  it("selectCategoriesHasLoaded should return hasLoaded state", () => {
    expect(selectCategoriesHasLoaded(mockState)).toBe(false);
  });

  it("selectCategoriesError should return error", () => {
    expect(selectCategoriesError(mockState)).toBe("Some error");
  });

  it("selectCategoriesMap should normalize and map categories correctly", () => {
    const result = selectCategoriesMap(mockState);

    expect(result).toEqual({
      hats: [{ id: 1, name: "Beanie" }],
      jackets: [{ id: 2, name: "Leather Jacket" }],
    });
  });

  it("selectCategoriesMap should ignore invalid titles or items", () => {
    const stateWithInvalidData = {
      category: {
        categories: [
          {
            title: "   ",
            items: [{ id: 1 }],
          },
          {
            title: null,
            items: "not-array",
          },
          {
            title: "Valid",
            items: [{ id: 2 }],
          },
        ],
        isLoading: false,
        hasLoaded: false,
        error: null,
      },
    } as any;

    const result = selectCategoriesMap(stateWithInvalidData);

    expect(result).toEqual({
      valid: [{ id: 2 }],
    });
  });
});
