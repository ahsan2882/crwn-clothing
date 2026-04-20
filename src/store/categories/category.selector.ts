import { createSelector } from "@reduxjs/toolkit";
import { CategoryState } from "../../models/category.model";
import { Product } from "../../models/product.model";

const categoryState = (state: { category: CategoryState }) => state.category;

export const selectCategories = createSelector([categoryState], (category) => {
  return category.categories;
});

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories) => {
    return categories.reduce<Record<string, Product[]>>((acc, category) => {
      const { title, items } = category;

      if (title && typeof title === "string" && items) {
        acc[title.toLowerCase()] = items;
      }

      return acc;
    }, {});
  },
);

export const selectCategoriesIsLoading = createSelector(
  [categoryState],
  (category) => category.isLoading,
);

export const selectCategoriesError = createSelector(
  [categoryState],
  (category) => category.error,
);
