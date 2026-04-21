import { useNavigate } from "react-router";
import { setIsCartOpen } from "../../store/cart/cart.reducer";
import { selectCartItems } from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Button from "../button/button.component";
import CartItem from "../cart-item/cart-item.component";
import {
  CartDropdownContainer,
  CartItems,
  EmptyMessage,
} from "./cart-dropdown.styles";

export default function CartDropdown() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const navigate = useNavigate();
  const goToCheckoutHandler = () => {
    navigate("/checkout");
    dispatch(setIsCartOpen(false));
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
