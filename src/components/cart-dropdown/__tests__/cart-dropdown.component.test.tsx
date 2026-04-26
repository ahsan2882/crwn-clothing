import { act, fireEvent, screen } from "@testing-library/react";
import CartDropdown from "../cart-dropdown.component";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import { addItemToCart, clearCart } from "../../../store/cart/cart.actions";
import { CartItemType } from "../../../models/product.model";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../../store/root.reducer";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockCartItemRenderSpy = jest.fn();

jest.mock("../../cart-item/cart-item.component", () => ({
  __esModule: true,
  default: ({ cartItem }: { cartItem: CartItemType }) => (
    <div data-testid="cart-item">{cartItem.name}</div>
  ),
}));

// // Mock child components
jest.mock("../../cart-item/cart-item.component", () => ({
  __esModule: true,
  default: ({ cartItem }: any) => {
    mockCartItemRenderSpy(cartItem);
    return <div data-testid="cart-item">{cartItem.name}</div>;
  },
}));

// CartDropdownContainer forwards the id prop and exposes a testid so
// tests never need document.getElementById or .closest().
jest.mock("../cart-dropdown.styles", () => ({
  CartDropdownContainer: ({
    children,
    id,
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="cart-dropdown-container" id={id}>
      {children}
    </div>
  ),
  CartItems: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-items">{children}</div>
  ),
  EmptyMessage: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="empty-message">{children}</span>
  ),
}));

const mockCartItems: CartItemType[] = [
  { id: 1, imageUrl: "test", name: "item 1", price: 20, quantity: 2 },
  {
    id: 2,
    imageUrl: "test2",
    name: "item 2",
    price: 25,
    quantity: 3,
  },
];

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    cart: {
      cartItems: [],
      isCartOpen: true,
    },
  },
});

const dispatchSpy = jest.spyOn(store, "dispatch");

describe("CartDropdown - structure", () => {
  it("renders the cart dropdown container with the correct id", () => {
    renderWithProviders(<CartDropdown />);
    expect(screen.getByTestId("cart-dropdown-container")).toHaveAttribute(
      "id",
      "cart-dropdown",
    );
  });

  it("always renders the checkout button", () => {
    renderWithProviders(<CartDropdown />);
    expect(
      screen.getByRole("button", { name: "GO TO CHECKOUT" }),
    ).toBeInTheDocument();
  });
});

describe("CartDropdown - render", () => {
  it("shows empty state when cart is empty", () => {
    renderWithProviders(<CartDropdown />, {
      preloadedState: { cart: { cartItems: [], isCartOpen: false } },
    });

    expect(screen.getByTestId("empty-message")).toHaveTextContent(
      "Your cart is empty",
    );
    expect(screen.queryAllByTestId("cart-item")).toHaveLength(0);
    expect(screen.queryByTestId("cart-items")).not.toBeInTheDocument();
  });

  it("renders correct number of cart items", () => {
    renderWithProviders(<CartDropdown />, {
      preloadedState: {
        cart: {
          cartItems: mockCartItems,
          isCartOpen: false,
        },
      },
    });
    expect(screen.getByTestId("cart-items")).toBeInTheDocument();
    expect(screen.getAllByTestId("cart-item")).toHaveLength(
      mockCartItems.length,
    );
  });

  it("hides empty message when items exist", () => {
    renderWithProviders(<CartDropdown />, {
      preloadedState: {
        cart: {
          cartItems: mockCartItems,
          isCartOpen: false,
        },
      },
    });

    expect(screen.queryByText("Your cart is empty")).not.toBeInTheDocument();
  });
});

describe("CartDropdown - reactivity", () => {
  it("updates UI when going from empty → populated", () => {
    const initialState = {
      cart: {
        cartItems: [],
        isCartOpen: true,
      },
    };

    const { store } = renderWithProviders(<CartDropdown />, {
      preloadedState: initialState,
    });

    // initial empty state
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryAllByTestId("cart-item")).toHaveLength(0);
    const newMockItem = {
      id: 1,
      name: "New Item",
      price: 100,
      imageUrl: "test",
    };
    act(() => {
      store.dispatch(addItemToCart(newMockItem));
    });

    // UI should update automatically via selector
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();

    const items = screen.getAllByTestId("cart-item");
    expect(items).toHaveLength(1);
  });
  it("updates UI when going from populated → empty", () => {
    const initialState = {
      cart: {
        cartItems: mockCartItems,
        isCartOpen: true,
      },
    };

    const { store } = renderWithProviders(<CartDropdown />, {
      preloadedState: initialState,
    });

    // initial empty state
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("cart-item")).toHaveLength(2);
    act(() => {
      store.dispatch(clearCart());
    });

    // UI should update automatically via selector
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    const items = screen.queryAllByTestId("cart-item");
    expect(items).toHaveLength(0);
  });
});

describe("CartDropdown - checkout handler", () => {
  it("navigates to /checkout on click", () => {
    renderWithProviders(<CartDropdown />);
    fireEvent.click(screen.getByRole("button", { name: "GO TO CHECKOUT" }));
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  it("dispatches setIsCartOpen(false) on click", () => {
    renderWithProviders(<CartDropdown />, { store });
    fireEvent.click(screen.getByRole("button", { name: /go to checkout/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cart/SET_IS_CART_OPEN",
        payload: false,
      }),
    );
  });

  it("does not navigate or dispatch before click", () => {
    renderWithProviders(<CartDropdown />);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
