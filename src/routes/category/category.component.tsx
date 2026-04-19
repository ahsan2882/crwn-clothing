import {
  // useContext,
  useMemo,
} from "react";
import { useParams } from "react-router";

import ProductCard from "../../components/product-card/product-card.component";

// import { CategoriesContext } from "../../contexts/categories.context";

import { useSelector } from "react-redux";
import { Product } from "../../models/product.model";
import { selectCategoriesMap } from "../../store/categories/category.selector";
import { CategoryContainer, CategoryTitle } from "./category.styles";

export default function Category() {
  const { category } = useParams();
  // const { categoriesMap } = useContext(CategoriesContext);
  const categoriesMap = useSelector(selectCategoriesMap);

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
