import { memo, useMemo } from "react";
import { useParams } from "react-router";

import ProductCard from "../../components/product-card/product-card.component";

import Spinner from "../../components/spinner/spinner.component";
import { Product } from "../../models/product.model";
import {
  selectCategoriesIsLoading,
  selectCategoriesMap,
} from "../../store/categories/category.selector";
import { useAppSelector } from "../../store/hooks";
import { CategoryContainer, CategoryTitle } from "./category.styles";

export default memo(function Category() {
  const { category } = useParams();
  const categoriesMap = useAppSelector(selectCategoriesMap);
  const isLoading = useAppSelector(selectCategoriesIsLoading);

  const products: Product[] = useMemo(
    () =>
      category ? (categoriesMap[category.trim().toLowerCase()] ?? []) : [],
    [category, categoriesMap],
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        category && (
          <>
            <CategoryTitle>{category.trim().toUpperCase()}</CategoryTitle>
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
});
