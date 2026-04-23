import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { setIsCartOpen } from "../../store/cart/cart.actions";
import { selectCartItems } from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Button from "../button/button.component";
import CartItem from "../cart-item/cart-item.component";
import {
  CartDropdownContainer,
  CartItems,
  EmptyMessage,
} from "./cart-dropdown.styles";

const CartDropdown = memo(function CartDropdown() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const navigate = useNavigate();
  const goToCheckoutHandler = useCallback(() => {
    navigate("/checkout");
    dispatch(setIsCartOpen(false));
  }, [dispatch, navigate]);

  const cartItemList = useMemo(
    () => cartItems.map((item) => <CartItem key={item.id} cartItem={item} />),
    [cartItems],
  );
  return (
    <CartDropdownContainer id="cart-dropdown">
      {cartItems.length > 0 ? (
        <CartItems>{cartItemList}</CartItems>
      ) : (
        <EmptyMessage>Your cart is empty</EmptyMessage>
      )}
      <Button type="button" onClickHandler={goToCheckoutHandler}>
        GO TO CHECKOUT
      </Button>
    </CartDropdownContainer>
  );
});
export default CartDropdown;
