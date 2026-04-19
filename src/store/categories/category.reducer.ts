import { createSlice } from "@reduxjs/toolkit";
import { CategoryState } from "../../models/category.model";
import { ProductCollection } from "../../models/product.model";
import { CATEGORY_ACTION_TYPES } from "./category.types";

const INITIAL_STATE: CategoryState = { categories: [] };

export const categoryReducer = createSlice({
  name: "category",
  initialState: INITIAL_STATE,
  reducers: {
    setCategories: (
      state: CategoryState,
      {
        payload,
      }: { payload: { type: string; categories: ProductCollection[] } },
    ): CategoryState => {
      const { type, categories } = payload;
      switch (type) {
        case CATEGORY_ACTION_TYPES.SET_CATEGORIES:
          return { ...state, categories };
        default:
          return state;
      }
    },
  },
});

export const { setCategories } = categoryReducer.actions;
const { reducer } = categoryReducer;
export { reducer as categoryReducers };
