import { memo, useMemo } from "react";
import CategoryPreview from "../../components/category-preview/category-preview.component";
import Spinner from "../../components/spinner/spinner.component";
import {
  selectCategoriesIsLoading,
  selectCategoriesMap,
} from "../../store/categories/category.selector";
import { useAppSelector } from "../../store/hooks";

export default memo(function CategoriesPreview() {
  const categoriesMap = useAppSelector(selectCategoriesMap);
  const isLoading = useAppSelector(selectCategoriesIsLoading);
  const categoryEntries = useMemo(
    () => Object.entries(categoriesMap),
    [categoriesMap],
  );
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        categoryEntries.map(([title, products]) => {
          return (
            <CategoryPreview key={title} title={title} products={products} />
          );
        })
      )}
    </>
  );
});
