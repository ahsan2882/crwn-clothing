import { createAction } from "@reduxjs/toolkit";
import { ProductCollection } from "../../models/product.model";

export const fetchCategoriesStart = createAction(
  "category/fetchCategoriesStart",
);
export const fetchCategoriesSuccess = createAction<ProductCollection[]>(
  "category/fetchCategoriesSuccess",
);
export const fetchCategoriesFailure = createAction<string>(
  "category/fetchCategoriesFailure",
);
