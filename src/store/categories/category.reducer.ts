import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryState } from "../../models/category.model";
import { ProductCollection } from "../../models/product.model";

const INITIAL_STATE: CategoryState = { categories: [] };

export const categoryReducer = createSlice({
  name: "category",
  initialState: INITIAL_STATE,
  reducers: {
    setCategories: (
      state: CategoryState,
      { payload }: PayloadAction<ProductCollection[]>,
    ): CategoryState => {
      return { ...state, categories: payload };
    },
  },
});

export const { setCategories } = categoryReducer.actions;
const { reducer } = categoryReducer;
export { reducer as categoryReducers };
