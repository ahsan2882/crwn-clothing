import { setIsCartOpen } from "../../store/cart/cart.actions";
import {
  selectCartCount,
  selectIsCartOpen,
} from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";

export default function CartIcon() {
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const cartCount = useAppSelector(selectCartCount);

  const dispatch = useAppDispatch();
  const onClickHandler = () => {
    dispatch(setIsCartOpen(!isCartOpen));
  };
  return (
    <CartIconContainer
      type="button"
      aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
      aria-expanded={isCartOpen}
      aria-controls="cart-dropdown"
      onClick={onClickHandler}
    >
      <ShopLogo />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
}
