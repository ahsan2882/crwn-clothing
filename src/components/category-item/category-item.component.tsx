import { Category } from "../../models/category.model";
import "./category-item.styles.scss";

export default function CategoryItem({ category }: { category: Category }) {
  const { imageUrl, title } = category;
  return (
    <div className="category-container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="category-body-container">
        <h2>{title}</h2>
        <p>Shop now!</p>
      </div>
    </div>
  );
}
