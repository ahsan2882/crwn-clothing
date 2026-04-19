// import { useContext } from "react";
import { Product } from "../../models/product.model";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  Footer,
  Name,
  Price,
  ProductCardContainer,
} from "./product-card.styles";
// import { CartContext } from "../../contexts/cart.context";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../store/cart/cart.reducer";
import { CART_ACTION_TYPES } from "../../store/cart/cart.types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, imageUrl, price } = product;

  const dispatch = useDispatch();
  // const { addItemToCart } = useContext(CartContext);
  const onAddToCartHandler = () => {
    dispatch(
      addItemToCart({
        type: CART_ACTION_TYPES.ADD_ITEM_TO_CART,
        cartItem: product,
      }),
    );
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
