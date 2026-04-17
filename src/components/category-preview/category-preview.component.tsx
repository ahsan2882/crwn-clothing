import "./category-preview.styles.scss";
import { Link } from "react-router";
import ProductCard from "../product-card/product-card.component";
import { Product } from "../../models/product.model";

type CategoryPreviewProps = {
  title: string;
  products: Product[];
};

export default function CategoryPreview({
  title,
  products,
}: CategoryPreviewProps) {
  return (
    <div className="category-preview-container">
      <h2>
        <Link className="title" to={title}>
          {title.toUpperCase()}
        </Link>
      </h2>
      <div className="preview">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
