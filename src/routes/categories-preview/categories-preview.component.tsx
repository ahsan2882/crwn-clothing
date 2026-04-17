import { useContext } from "react";

import { CategoriesContext } from "../../contexts/categories.context";
import CategoryPreview from "../../components/category-preview/category-preview.component";

export default function CategoriesPreview() {
  const { categoriesMap } = useContext(CategoriesContext);

  return (
    <>
      {Object.entries(categoriesMap).map(([title, products]) => {
        return (
          <CategoryPreview key={title} title={title} products={products} />
        );
      })}
    </>
  );
}
