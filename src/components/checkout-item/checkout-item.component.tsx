import { CartContext } from "../../contexts/cart.context";
import { CartItemType } from "../../models/product.model";
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
import { useContext } from "react";

type CheckoutItemProps = {
  cartItem: CartItemType;
};

export default function CheckoutItem({ cartItem }: CheckoutItemProps) {
  const { name, imageUrl, price, quantity } = cartItem;

  const { clearItemFromCart, addItemToCart, removeItemFromCart } =
    useContext(CartContext);

  const clearItemHandler = () => clearItemFromCart(cartItem);
  const addItemHandler = () => addItemToCart(cartItem);
  const removeItemHandler = () => removeItemFromCart(cartItem);
  return (
    <CheckoutItemContainer>
      <ImageContainer>
        <Img src={imageUrl} alt={`${name}`} />
      </ImageContainer>
      <ItemInfo> {name} </ItemInfo>
      <Quantity>
        <QuantityArrow role="button" onClick={removeItemHandler}>
          &#10094;
        </QuantityArrow>
        <QuantityValue>{quantity}</QuantityValue>
        <QuantityArrow role="button" onClick={addItemHandler}>
          &#10095;
        </QuantityArrow>
      </Quantity>
      <ItemInfo> {price}</ItemInfo>
      <RemoveButton role="button" onClick={clearItemHandler}>
        &#10005;
      </RemoveButton>
    </CheckoutItemContainer>
  );
}
