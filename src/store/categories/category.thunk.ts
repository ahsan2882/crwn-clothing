import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductCollection } from "../../models/product.model";
import { getCategoriesAndDocuments } from "../../utils/firebase/firebase.utils";

export const fetchCategoriesAsync = createAsyncThunk<ProductCollection[]>(
  "category/fetchCategories",
  async () => {
    const categories = await getCategoriesAndDocuments("categories");
    return categories;
  },
);
