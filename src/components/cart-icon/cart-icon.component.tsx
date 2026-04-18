import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";

export default function CartIcon() {
  const { isCartOpen, setIsCartOpen, cartCount } = useContext(CartContext);
  return (
    <CartIconContainer
      type="button"
      aria-label={`${isCartOpen ? "Close" : "Open"} cart, ${cartCount} ${
        cartCount === 1 ? "item" : "items"
      }`}
      onClick={() => setIsCartOpen(!isCartOpen)}
    >
      <ShopLogo />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
}
