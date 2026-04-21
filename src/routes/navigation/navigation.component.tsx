// import { useContext } from "react";
import { Outlet } from "react-router";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import {
  LogoContainer,
  NavigationContainer,
  NavLink,
  NavLinks,
} from "./navigation.styles";
// import { UserContext } from "../../contexts/user.context";
import Button, {
  BUTTON_TYPE_CLASSES,
} from "../../components/button/button.component";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";
import CartIcon from "../../components/cart-icon/cart-icon.component";
// import { CartContext } from "../../contexts/cart.context";
import { selectIsCartOpen } from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOutStart } from "../../store/user/user.actions";
import { selectCurrentUser } from "../../store/user/user.selector";

export default function Navigation() {
  const dispatch = useAppDispatch();
  // using redux selector instead of context
  // const { currentUser } = useContext(UserContext);
  const currentUser = useAppSelector(selectCurrentUser);
  // const { isCartOpen } = useContext(CartContext);
  const isCartOpen = useAppSelector(selectIsCartOpen);

  const signOutHandler = async () => {
    dispatch(signOutStart());
  };

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
              type="button"
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
}
