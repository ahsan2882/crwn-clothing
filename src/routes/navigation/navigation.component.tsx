import { memo, useCallback } from "react";
import { Outlet } from "react-router";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import Button, {
  BUTTON_TYPE_CLASSES,
} from "../../components/button/button.component";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";
import CartIcon from "../../components/cart-icon/cart-icon.component";
import { selectIsCartOpen } from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOutStart } from "../../store/user/user.actions";
import { selectCurrentUser } from "../../store/user/user.selector";
import {
  LogoContainer,
  NavigationContainer,
  NavLink,
  NavLinks,
} from "./navigation.styles";

export default memo(function Navigation() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isCartOpen = useAppSelector(selectIsCartOpen);

  const signOutHandler = useCallback(() => {
    dispatch(signOutStart());
  }, [dispatch]);

  return (
    <>
      <NavigationContainer>
        <LogoContainer to="/">
          <Logo />
        </LogoContainer>
        <NavLinks>
          <NavLink to="/shop">SHOP</NavLink>
          {currentUser ? (
            <Button
              buttonStyle={BUTTON_TYPE_CLASSES.inverted}
              onClickHandler={signOutHandler}
            >
              SIGN OUT
            </Button>
          ) : (
            <NavLink to="/auth">SIGN IN</NavLink>
          )}
          <CartIcon />
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </>
  );
});
