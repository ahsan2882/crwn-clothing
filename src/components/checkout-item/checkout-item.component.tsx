import { CartItemType } from "../../models/product.model";
import {
  addItemToCart,
  clearItemFromCart,
  removeItemFromCart,
} from "../../store/cart/cart.actions";
import { useAppDispatch } from "../../store/hooks";
import {
  CheckoutItemContainer,
  ImageContainer,
  Img,
  ItemInfo,
  Quantity,
  QuantityArrow,
  QuantityValue,
  RemoveButton,
} from "./checkout-item.styles";

type CheckoutItemProps = {
  cartItem: CartItemType;
};

export default function CheckoutItem({ cartItem }: CheckoutItemProps) {
  const { name, imageUrl, price, quantity } = cartItem;
  const dispatch = useAppDispatch();
  const clearItemHandler = () => dispatch(clearItemFromCart(cartItem));
  const addItemHandler = () => dispatch(addItemToCart(cartItem));
  const removeItemHandler = () => dispatch(removeItemFromCart(cartItem));
  return (
    <CheckoutItemContainer>
      <ImageContainer>
        <Img src={imageUrl} alt={`${name}`} />
      </ImageContainer>
      <ItemInfo> {name} </ItemInfo>
      <Quantity>
        <QuantityArrow
          onClick={removeItemHandler}
          aria-label={`Decrease quantity of ${name}`}
        >
          &#10094;
        </QuantityArrow>
        <QuantityValue>{quantity}</QuantityValue>
        <QuantityArrow
          onClick={addItemHandler}
          aria-label={`Increase quantity of ${name}`}
        >
          &#10095;
        </QuantityArrow>
      </Quantity>
      <ItemInfo> {price}</ItemInfo>
      <RemoveButton
        onClick={clearItemHandler}
        aria-label={`Remove ${name} from cart`}
      >
        &#10005;
      </RemoveButton>
    </CheckoutItemContainer>
  );
}
