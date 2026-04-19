import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router";
import { setCategories } from "../../store/categories/category.reducer";
import { CATEGORY_ACTION_TYPES } from "../../store/categories/category.types";
import { getCategoriesAndDocuments } from "../../utils/firebase/firebase.utils";
import CategoriesPreview from "../categories-preview/categories-preview.component";
import Category from "../category/category.component";

export default function Shop() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCategoriesMap = async () => {
      try {
        const categories = await getCategoriesAndDocuments("categories");
        dispatch(
          setCategories({
            type: CATEGORY_ACTION_TYPES.SET_CATEGORIES,
            categories,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    };

    getCategoriesMap();
  }, [dispatch]);
  return (
    <Routes>
      <Route index element={<CategoriesPreview />} />
      <Route path=":category" element={<Category />} />
    </Routes>
  );
}
