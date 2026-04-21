import CategoryPreview from "../../components/category-preview/category-preview.component";
import Spinner from "../../components/spinner/spinner.component";
import {
  selectCategoriesIsLoading,
  selectCategoriesMap,
} from "../../store/categories/category.selector";
import { useAppSelector } from "../../store/hooks";

export default function CategoriesPreview() {
  const categoriesMap = useAppSelector(selectCategoriesMap);
  const isLoading = useAppSelector(selectCategoriesIsLoading);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        Object.entries(categoriesMap).map(([title, products]) => {
          return (
            <CategoryPreview key={title} title={title} products={products} />
          );
        })
      )}
    </>
  );
}
