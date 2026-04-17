import { useContext } from "react";
import { Product } from "../../models/product.model";
import Button from "../button/button.component";
import "./product-card.styles.scss";
import { CartContext } from "../../contexts/cart.context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, imageUrl, price } = product;
  const { addItemToCart } = useContext(CartContext);
  const onAddToCartHandler = () => {
    addItemToCart(product);
  };
  return (
    <div className="product-card-container">
      <img src={imageUrl} alt={name} />
      <div className="footer">
        <span className="name">{name}</span>
        <span className="price">{price}</span>
      </div>
      <Button
        type="button"
        buttonStyle="inverted"
        onClickHandler={onAddToCartHandler}
      >
        Add to cart
      </Button>
    </div>
  );
}
