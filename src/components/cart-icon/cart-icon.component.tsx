import "./cart-icon.styles.scss";

import { ReactComponent as ShoppingIcon } from "../../assets/shopping-bag.svg";
import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";

export default function CartIcon() {
  const { setIsCartOpen, cartCount } = useContext(CartContext);
  return (
    <button
      type="button"
      className="cart-icon-container"
      aria-label={`Open cart, ${cartCount} items`}
      onClick={() => setIsCartOpen((state) => !state)}
    >
      <ShoppingIcon className="shopping-icon" />
      <span className="item-count">{cartCount}</span>
    </button>
  );
}
