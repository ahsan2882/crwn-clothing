import {
  CategoryPreviewContainer,
  LinkTitle,
  Preview,
} from "./category-preview.styles";

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
    <CategoryPreviewContainer>
      <h2>
        <LinkTitle to={title.toLowerCase()}>{title.toUpperCase()}</LinkTitle>
      </h2>
      <Preview>
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Preview>
    </CategoryPreviewContainer>
  );
}
