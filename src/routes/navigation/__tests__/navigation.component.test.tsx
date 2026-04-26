import { configureStore } from "@reduxjs/toolkit";
import {
  ExtendedRenderOptions,
  renderWithProviders,
} from "../../../utils/tests/tests.utils";
import Navigation from "../navigation.component";
import { fireEvent, screen } from "@testing-library/react";
import { rootReducer } from "../../../store/root.reducer";
import { User } from "firebase/auth";
import { UserState } from "../../../models/user.model";
import { CartState } from "../../../models/cart.model";
import { signOutStart } from "../../../store/user/user.actions";

jest.mock("../../../components/cart-icon/cart-icon.component", () => () => (
  <div data-testid="cart-icon" />
));

jest.mock(
  "../../../components/cart-dropdown/cart-dropdown.component",
  () => () => <div data-testid="cart-dropdown" />,
);

jest.mock("../../../components/button/button.component", () => ({
  __esModule: true,
  default: ({ children, onClickHandler }: any) => (
    <button onClick={onClickHandler}>{children}</button>
  ),
  BUTTON_TYPE_CLASSES: {
    inverted: "inverted",
  },
}));

jest.mock("../../../assets/crown.svg", () => ({
  ReactComponent: () => <svg data-testid="logo" />,
}));

const renderComponent = (options?: ExtendedRenderOptions) =>
  renderWithProviders(<Navigation />, options);

const nullUserState = {
  currentUser: null,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

const userSignedInState = {
  currentUser: { email: "test@gmail.com", displayName: "John Doe" } as User,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

const collapsedCart: CartState = {
  cartItems: [],
  isCartOpen: false,
};

const expandedCart: CartState = {
  cartItems: [],
  isCartOpen: true,
};

const createStoreInstance = ({
  userState = nullUserState,
  cartState = collapsedCart,
}: {
  userState?: UserState;
  cartState?: CartState;
} = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      cart: cartState,
      user: userState,
    },
  });

describe("Navigation Component", () => {
  describe("Rendering", () => {
    const store = createStoreInstance();
    it("renders logo, shop link and cart icon", () => {
      renderComponent({ store });
      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("SHOP")).toBeInTheDocument();
      expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
    });

    it("shows SIGN IN when user is not logged in", () => {
      renderComponent({ store });
      expect(screen.getByText("SIGN IN")).toBeInTheDocument();
      expect(screen.queryByText("SIGN OUT")).not.toBeInTheDocument();
    });

    it("shows SIGN OUT when user is logged in", () => {
      const signedInStore = createStoreInstance({
        userState: userSignedInState,
      });
      renderComponent({ store: signedInStore });
      expect(screen.getByText("SIGN OUT")).toBeInTheDocument();
      expect(screen.queryByText("SIGN IN")).not.toBeInTheDocument();
    });
  });

  describe("Cart dropdown", () => {
    it("renders CartDropdown when isCartOpen is true", () => {
      const expandedCartStore = createStoreInstance({
        cartState: expandedCart,
      });
      renderComponent({ store: expandedCartStore });
      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();
    });

    it("does not render CartDropdown when isCartOpen is false", () => {
      const store = createStoreInstance();
      renderComponent({ store });
      expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("dispatches signOutStart when SIGN OUT clicked", () => {
      const signedInStore = createStoreInstance({
        userState: userSignedInState,
      });
      const dispatchSpy = jest.spyOn(signedInStore, "dispatch");
      renderComponent({ store: signedInStore });

      fireEvent.click(screen.getByText("SIGN OUT"));

      expect(dispatchSpy).toHaveBeenCalledWith(signOutStart());
    });
  });

  describe("Navigation links", () => {
    it("renders shop and auth links correctly", () => {
      const store = createStoreInstance();
      renderComponent({ store });
      expect(screen.getByText("SHOP")).toHaveAttribute("href", "/shop");
      expect(screen.getByText("SIGN IN")).toHaveAttribute("href", "/auth");
    });
  });
});
