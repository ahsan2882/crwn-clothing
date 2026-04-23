import { memo, useCallback } from "react";
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

export default memo(function CheckoutItem({ cartItem }: CheckoutItemProps) {
  const { name, imageUrl, price, quantity } = cartItem;
  const dispatch = useAppDispatch();
  const clearItemHandler = useCallback(
    () => dispatch(clearItemFromCart(cartItem)),
    [dispatch, cartItem],
  );
  const addItemHandler = useCallback(
    () => dispatch(addItemToCart(cartItem)),
    [dispatch, cartItem],
  );
  const removeItemHandler = useCallback(
    () => dispatch(removeItemFromCart(cartItem)),
    [dispatch, cartItem],
  );
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
});
