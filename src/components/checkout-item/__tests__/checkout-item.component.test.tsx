import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import {
  addItemToCart,
  clearItemFromCart,
  removeItemFromCart,
} from "../../../store/cart/cart.actions";
import { rootReducer } from "../../../store/root.reducer";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import CheckoutItem from "../checkout-item.component";

describe("Checkout Item - render", () => {
  const mockItem = {
    id: 1,
    name: "Test Product",
    imageUrl: "https://test.com/image.png",
    price: 100,
    quantity: 2,
  };

  it("renders all item details correctly", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders image with correct src and alt", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockItem.imageUrl);
    expect(img).toHaveAttribute("alt", mockItem.name);
  });

  it("renders all control buttons with accessible labels", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />);
    expect(
      screen.getByRole("button", {
        name: `Increase quantity of ${mockItem.name}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Decrease quantity of ${mockItem.name}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Remove ${mockItem.name} from cart`,
      }),
    ).toBeInTheDocument();
  });
});

describe("CheckoutItem - dispatch behavior", () => {
  const mockItem = {
    id: 1,
    name: "Test Product",
    imageUrl: "img.png",
    price: 100,
    quantity: 2,
  };
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { cart: { cartItems: [], isCartOpen: false } },
  });
  const dispatchSpy = jest.spyOn(store, "dispatch");

  it("dispatches addItemToCart when clicking increase", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />, { store });
    fireEvent.click(
      screen.getByRole("button", {
        name: /increase quantity/i,
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToCart(mockItem));
  });

  it("dispatches removeItemFromCart when clicking decrease", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />, { store });
    fireEvent.click(
      screen.getByRole("button", {
        name: /decrease quantity/i,
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(removeItemFromCart(mockItem));
  });

  it("dispatches clearItemFromCart when clicking remove", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />, { store });
    fireEvent.click(
      screen.getByRole("button", {
        name: /remove test product from cart/i,
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(clearItemFromCart(mockItem));
  });

  it("dispatches correct number of times on multiple clicks", () => {
    renderWithProviders(<CheckoutItem cartItem={mockItem} />, { store });
    const increaseBtn = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });
});

describe("CheckoutItem - reducer integration (no mocks)", () => {
  const mockItem = {
    id: 1,
    name: "Test Product",
    imageUrl: "img.png",
    price: 100,
    quantity: 2,
  };

  it("increases quantity in store when clicking increase", () => {
    const { store } = renderWithProviders(
      <CheckoutItem cartItem={mockItem} />,
      {
        preloadedState: {
          cart: {
            isCartOpen: true,
            cartItems: [mockItem],
          },
        },
      },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /increase quantity/i,
      }),
    );
    const state = store.getState().cart.cartItems[0];
    expect(state.quantity).toBe(3);
  });

  it("decreases quantity in store when clicking decrease", () => {
    const { store } = renderWithProviders(
      <CheckoutItem cartItem={mockItem} />,
      {
        preloadedState: {
          cart: {
            isCartOpen: true,
            cartItems: [mockItem],
          },
        },
      },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /decrease quantity/i,
      }),
    );
    const state = store.getState().cart.cartItems[0];
    expect(state.quantity).toBe(1);
  });

  it("removes item when quantity reaches zero", () => {
    const item = { ...mockItem, quantity: 1 };
    const { store } = renderWithProviders(<CheckoutItem cartItem={item} />, {
      preloadedState: {
        cart: {
          isCartOpen: true,
          cartItems: [item],
        },
      },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /decrease quantity/i,
      }),
    );
    expect(store.getState().cart.cartItems).toHaveLength(0);
  });

  it("clears item completely when remove button clicked", () => {
    const { store } = renderWithProviders(
      <CheckoutItem cartItem={mockItem} />,
      {
        preloadedState: {
          cart: {
            isCartOpen: true,
            cartItems: [mockItem],
          },
        },
      },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /remove test product from cart/i,
      }),
    );
    expect(store.getState().cart.cartItems).toHaveLength(0);
  });
});
