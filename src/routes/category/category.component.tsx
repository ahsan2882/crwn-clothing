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

  const normalizedCategory = useMemo(() => category?.trim() ?? "", [category]);

  const products: Product[] = useMemo(
    () =>
      normalizedCategory
        ? (categoriesMap[normalizedCategory.toLowerCase()] ?? [])
        : [],
    [normalizedCategory, categoriesMap],
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        normalizedCategory && (
          <>
            <CategoryTitle>
              {normalizedCategory.trim().toUpperCase()}
            </CategoryTitle>
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
