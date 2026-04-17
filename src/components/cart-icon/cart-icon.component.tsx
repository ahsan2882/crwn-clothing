import "./cart-icon.styles.scss";

import { ReactComponent as ShoppingIcon } from "../../assets/shopping-bag.svg";
import { useContext } from "react";
import { CartContext } from "../../contexts/cart.context";

export default function CartIcon() {
  const { setIsCartOpen, cartCount } = useContext(CartContext);
  return (
    <div className="cart-icon-container">
      <ShoppingIcon
        className="shopping-icon"
        onClick={() => setIsCartOpen((state) => !state)}
      />
      <span className="item-count">{cartCount}</span>
    </div>
  );
}
