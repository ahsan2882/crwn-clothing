import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";

export default function CartIcon() {
  const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);
  const toggleState = (state: boolean) => !state;
  return (
    <CartIconContainer
      type="button"
      aria-label={`Open cart, ${cartCount} items`}
      onClick={() => setIsCartOpen(toggleState(isCartOpen))}
    >
      <ShopLogo />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
}
