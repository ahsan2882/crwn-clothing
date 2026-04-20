import {
  // useContext,
  useMemo,
} from "react";
import { useParams } from "react-router";

import ProductCard from "../../components/product-card/product-card.component";

// import { CategoriesContext } from "../../contexts/categories.context";

import { Product } from "../../models/product.model";
import {
  selectCategoriesIsLoading,
  selectCategoriesMap,
} from "../../store/categories/category.selector";
import { useAppSelector } from "../../store/hooks";
import { CategoryContainer, CategoryTitle } from "./category.styles";
import Spinner from "../../components/spinner/spinner.component";

export default function Category() {
  const { category } = useParams();
  // const { categoriesMap } = useContext(CategoriesContext);
  const categoriesMap = useAppSelector(selectCategoriesMap);
  const isLoading = useAppSelector(selectCategoriesIsLoading);

  const products: Product[] = useMemo(
    () => (category ? (categoriesMap[category] ?? []) : []),
    [category, categoriesMap],
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        category && (
          <>
            <CategoryTitle>{category.toUpperCase()}</CategoryTitle>
            <CategoryContainer>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CategoryContainer>
          </>
        )
      )}
    </>
  );
}
