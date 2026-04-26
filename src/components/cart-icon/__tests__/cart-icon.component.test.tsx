import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import CartIcon from "../cart-icon.component";
import { setIsCartOpen } from "../../../store/cart/cart.actions";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../../store/root.reducer";

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    cart: {
      cartItems: [],
      isCartOpen: false,
    },
  },
});

const dispatchSpy = jest.spyOn(store, "dispatch");

describe("Cart Icon - rendering", () => {
  it("renders cart icon and count", () => {
    const initialCartItems = [
      { id: 1, quantity: 2, price: 10, name: "Item1", imageUrl: "test" },
      { id: 2, quantity: 1, price: 5, name: "Item2", imageUrl: "test" },
    ];
    renderWithProviders(<CartIcon />, {
      preloadedState: {
        cart: {
          isCartOpen: false,
          cartItems: initialCartItems,
        },
      },
    });

    expect(screen.getByText("3")).toBeInTheDocument();
  });
  it("sets correct aria attributes for multiple items", () => {
    const initialCartItems = [
      { id: 1, quantity: 2, price: 10, name: "Item1", imageUrl: "test" },
      { id: 2, quantity: 1, price: 5, name: "Item2", imageUrl: "test" },
    ];
    renderWithProviders(<CartIcon />, {
      preloadedState: {
        cart: {
          isCartOpen: true,
          cartItems: initialCartItems,
        },
      },
    });

    const button = screen.getByRole("button", {
      name: /cart/i,
    });

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "cart-dropdown");
    expect(button).toHaveAttribute("aria-label", "Cart, 3 items");
  });
  it("sets correct aria attributes for single items", () => {
    const initialCartItems = [
      { id: 2, quantity: 1, price: 5, name: "Item2", imageUrl: "test" },
    ];
    renderWithProviders(<CartIcon />, {
      preloadedState: {
        cart: {
          isCartOpen: true,
          cartItems: initialCartItems,
        },
      },
    });

    const button = screen.getByRole("button", {
      name: /cart/i,
    });

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "cart-dropdown");
    expect(button).toHaveAttribute("aria-label", "Cart, 1 item");
  });
});

describe("Cart icon - toggles cart state", () => {
  it("dispatches setIsCartOpen with toggled value (false → true)", () => {
    renderWithProviders(<CartIcon />, {
      store,
    });

    fireEvent.click(screen.getByRole("button"));

    expect(dispatchSpy).toHaveBeenCalledWith(setIsCartOpen(true));
  });
});
