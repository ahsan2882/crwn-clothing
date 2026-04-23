import { memo, useCallback } from "react";
import { Product } from "../../models/product.model";
import { addItemToCart } from "../../store/cart/cart.actions";
import { useAppDispatch } from "../../store/hooks";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  Footer,
  Name,
  Price,
  ProductCardContainer,
} from "./product-card.styles";

interface ProductCardProps {
  product: Product;
}

export default memo(function ProductCard({ product }: ProductCardProps) {
  const { name, imageUrl, price } = product;

  const dispatch = useAppDispatch();
  const onAddToCartHandler = useCallback(() => {
    dispatch(addItemToCart(product));
  }, [dispatch, product]);
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
});
