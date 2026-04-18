import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";
import { CartIconContainer, ItemCount, ShopLogo } from "./cart-icon.styles";

export default function CartIcon() {
  const { setIsCartOpen, cartCount } = useContext(CartContext);
  return (
    <CartIconContainer
      type="button"
      aria-label={`Open cart, ${cartCount} items`}
      onClick={() => setIsCartOpen((state) => !state)}
    >
      <ShopLogo className="shopping-icon" />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
}
