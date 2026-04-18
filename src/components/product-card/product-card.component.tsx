import { useContext } from "react";
import { Product } from "../../models/product.model";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  ProductCardContainer,
  Footer,
  Name,
  Price,
} from "./product-card.styles";
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
    <ProductCardContainer>
      <img src={imageUrl} alt={name} />
      <Footer>
        <Name>{name}</Name>
        <Price>{price}</Price>
      </Footer>
      <Button
        type="button"
        buttonStyle={BUTTON_TYPE_CLASSES.inverted}
        onClickHandler={onAddToCartHandler}
      >
        Add to cart
      </Button>
    </ProductCardContainer>
  );
}
