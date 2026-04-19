// import { useContext } from "react";
// import { CartContext } from "../../contexts/cart.context";
import { useDispatch, useSelector } from "react-redux";
import { setIsCartOpen } from "../../store/cart/cart.reducer";
import {
  selectCartCount,
  selectIsCartOpen,
} from "../../store/cart/cart.selector";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";

export default function CartIcon() {
  // const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);
  const isCartOpen = useSelector(selectIsCartOpen);
  const cartCount = useSelector(selectCartCount);

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
