import { memo, useEffect } from "react";
import { Route, Routes } from "react-router";
import Spinner from "../../components/spinner/spinner.component";
import { fetchCategoriesStart } from "../../store/categories/category.actions";
import {
  selectCategoriesError,
  selectCategoriesHasLoaded,
  selectCategoriesIsLoading,
} from "../../store/categories/category.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CategoriesPreview from "../categories-preview/categories-preview.component";
import Category from "../category/category.component";

export default memo(function Shop() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectCategoriesIsLoading);
  const hasLoaded = useAppSelector(selectCategoriesHasLoaded);
  const error = useAppSelector(selectCategoriesError);
  useEffect(() => {
    if (!hasLoaded && !isLoading && !error) {
      dispatch(fetchCategoriesStart());
    }
  }, [dispatch, error, hasLoaded, isLoading]);
  if (error) return <p>Error: {error}</p>;
  return isLoading ? (
    <Spinner />
  ) : (
    <Routes>
      <Route index element={<CategoriesPreview />} />
      <Route path=":category" element={<Category />} />
    </Routes>
  );
});
