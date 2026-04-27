import { createSelector } from "@reduxjs/toolkit";
import { CategoriesMap, CategoryState } from "../../models/category.model";

const categoryState = (state: { category: CategoryState }) => state.category;

export const selectCategories = createSelector([categoryState], (category) => {
  return category.categories;
});

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories): CategoriesMap => {
    return categories.reduce<CategoriesMap>((acc, { title, items }) => {
      if (typeof title === "string" && title.trim() && Array.isArray(items)) {
        acc[title.trim().toLowerCase()] = items;
      }
      return acc;
    }, {});
  },
);

export const selectCategoriesIsLoading = createSelector(
  [categoryState],
  (category) => category.isLoading,
);

export const selectCategoriesHasLoaded = createSelector(
  [categoryState],
  (category) => category.hasLoaded,
);

export const selectCategoriesError = createSelector(
  [categoryState],
  (category) => category.error,
);
