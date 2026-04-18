import { useContext, useMemo } from "react";
import { useParams } from "react-router";

import ProductCard from "../../components/product-card/product-card.component";

import { CategoriesContext } from "../../contexts/categories.context";

import { CategoryContainer, CategoryTitle } from "./category.styles";
import { Product } from "../../models/product.model";

export default function Category() {
  const { category } = useParams();
  const { categoriesMap } = useContext(CategoriesContext);

  const products: Product[] = useMemo(
    () => (category ? (categoriesMap[category] ?? []) : []),
    [category, categoriesMap],
  );

  return (
    <>
      {category && (
        <>
          <CategoryTitle>{category.toUpperCase()}</CategoryTitle>
          <CategoryContainer>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CategoryContainer>
        </>
      )}
    </>
  );
}
