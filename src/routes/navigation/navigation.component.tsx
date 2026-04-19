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
import { useSelector } from "react-redux";
import Button, {
  BUTTON_TYPE_CLASSES,
} from "../../components/button/button.component";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown.component";
import CartIcon from "../../components/cart-icon/cart-icon.component";
// import { CartContext } from "../../contexts/cart.context";
import { selectIsCartOpen } from "../../store/cart/cart.selector";
import { selectCurrentUser } from "../../store/user/user.selector";
import { signOutUser } from "../../utils/firebase/firebase.utils";

export default function Navigation() {
  // using redux selector instead of context
  // const { currentUser } = useContext(UserContext);
  const currentUser = useSelector(selectCurrentUser);
  // const { isCartOpen } = useContext(CartContext);
  const isCartOpen = useSelector(selectIsCartOpen);

  const signOutHandler = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign out failed", error);
    }
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
