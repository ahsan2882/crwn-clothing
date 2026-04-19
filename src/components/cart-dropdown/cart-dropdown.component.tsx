// import { useContext } from "react";
import Button from "../button/button.component";
import {
  CartDropdownContainer,
  CartItems,
  EmptyMessage,
} from "./cart-dropdown.styles";
// import { CartContext } from "../../contexts/cart.context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setIsCartOpen } from "../../store/cart/cart.reducer";
import { selectCartItems } from "../../store/cart/cart.selector";
import { CART_ACTION_TYPES } from "../../store/cart/cart.types";
import CartItem from "../cart-item/cart-item.component";

export default function CartDropdown() {
  // const { cartItems, setIsCartOpen } = useContext(CartContext);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();
  const goToCheckoutHandler = () => {
    navigate("/checkout");
    dispatch(
      setIsCartOpen({
        type: CART_ACTION_TYPES.SET_IS_CART_OPEN,
        isCartOpen: false,
      }),
    );
  };
  return (
    <CartDropdownContainer>
      {cartItems.length > 0 ? (
        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={item.id} cartItem={item} />
          ))}
        </CartItems>
      ) : (
        <EmptyMessage>Your cart is empty</EmptyMessage>
      )}
      <Button type="button" onClickHandler={goToCheckoutHandler}>
        GO TO CHECKOUT
      </Button>
    </CartDropdownContainer>
  );
}
