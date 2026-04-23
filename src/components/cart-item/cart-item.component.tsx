import { memo } from "react";
import { CartItemType } from "../../models/product.model";
import {
  CartItemContainer,
  CartItemImage,
  ItemDetails,
  ItemName,
} from "./cart-item.styles";

interface CartItemProps {
  cartItem: CartItemType;
}

export default memo(function CartItem({ cartItem }: CartItemProps) {
  const { name, quantity, imageUrl, price } = cartItem;
  return (
    <CartItemContainer>
      <CartItemImage src={imageUrl} alt={`${name}`} />
      <ItemDetails>
        <ItemName>{name}</ItemName>
        <span>
          {quantity} x ${price}
        </span>
      </ItemDetails>
    </CartItemContainer>
  );
});
