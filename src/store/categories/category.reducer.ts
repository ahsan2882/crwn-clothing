import { createSlice } from "@reduxjs/toolkit";
import { CategoryState } from "../../models/category.model";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from "./category.actions";

const INITIAL_STATE: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
};

export const categoryReducer = createSlice({
  name: "category",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesStart, (state) => {
        state.isLoading = true;
        state.hasLoaded = false;
        state.error = null;
      })
      .addCase(fetchCategoriesSuccess, (state, { payload }) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = null;
        state.categories = payload;
      })
      .addCase(fetchCategoriesFailure, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

const { reducer } = categoryReducer;
export { reducer as categoryReducers };
