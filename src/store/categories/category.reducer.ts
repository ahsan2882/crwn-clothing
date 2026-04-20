import { createSlice } from "@reduxjs/toolkit";
import { CategoryState } from "../../models/category.model";
import { fetchCategoriesAsync } from "./category.thunk";

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
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = null;
        state.categories = payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message ?? "Failed to fetch categories";
      });
  },
});

const { reducer } = categoryReducer;
export { reducer as categoryReducers };
