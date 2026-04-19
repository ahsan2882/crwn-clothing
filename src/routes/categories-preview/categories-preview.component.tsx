// import { useContext } from "react";

// import { CategoriesContext } from "../../contexts/categories.context";
import { useSelector } from "react-redux";
import CategoryPreview from "../../components/category-preview/category-preview.component";
import { selectCategoriesMap } from "../../store/categories/category.selector";

export default function CategoriesPreview() {
  // const { categoriesMap } = useContext(CategoriesContext);
  const categoriesMap = useSelector(selectCategoriesMap);

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
