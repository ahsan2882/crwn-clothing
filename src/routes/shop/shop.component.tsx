import { useEffect } from "react";
import { Route, Routes } from "react-router";
import {
  selectCategoriesError,
  selectCategoriesIsLoading,
} from "../../store/categories/category.selector";
import { fetchCategoriesAsync } from "../../store/categories/category.thunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CategoriesPreview from "../categories-preview/categories-preview.component";
import Category from "../category/category.component";
import Spinner from "../../components/spinner/spinner.component";

export default function Shop() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectCategoriesIsLoading);
  const error = useAppSelector(selectCategoriesError);
  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);
  if (error) return <p>Error: {error.message}</p>;
  return isLoading ? (
    <Spinner />
  ) : (
    <Routes>
      <Route index element={<CategoriesPreview />} />
      <Route path=":category" element={<Category />} />
    </Routes>
  );
}
