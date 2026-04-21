// import { useContext } from "react";
// import { CartContext } from "../../contexts/cart.context";
import { useDispatch } from "react-redux";
import { setIsCartOpen } from "../../store/cart/cart.reducer";
import {
  selectCartCount,
  selectIsCartOpen,
} from "../../store/cart/cart.selector";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";
import { useAppSelector } from "../../store/hooks";

export default function CartIcon() {
  // const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const cartCount = useAppSelector(selectCartCount);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setIsCartOpen(!isCartOpen));
  };
  return (
    <CartIconContainer
      type="button"
      aria-label={`${isCartOpen ? "Close" : "Open"} cart, ${cartCount} ${
        cartCount === 1 ? "item" : "items"
      }`}
      onClick={onClickHandler}
    >
      <ShopLogo />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
}
