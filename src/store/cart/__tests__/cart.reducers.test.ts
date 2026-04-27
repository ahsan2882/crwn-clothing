import {
  addItemToCart,
  clearCart,
  clearItemFromCart,
  removeItemFromCart,
  setIsCartOpen,
} from "../cart.actions";
import { cartReducers } from "../cart.reducer";

describe("cart reducer", () => {
  const initialState = {
    isCartOpen: false,
    cartItems: [],
  };

  const sampleProduct = {
    id: 1,
    name: "Hat",
    price: 10,
    imageUrl: "test",
  };

  const sampleCartItem = {
    id: 1,
    name: "Hat",
    price: 10,
    quantity: 2,
    imageUrl: "test",
  };
  const anotherSampleCartItem = {
    id: 2,
    name: "Jeans",
    price: 100,
    quantity: 1,
    imageUrl: "test",
  };

  it("should return initial state", () => {
    expect(cartReducers(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("should toggle cart open state", () => {
    const state = cartReducers(initialState, setIsCartOpen(true));

    expect(state.isCartOpen).toBe(true);
  });

  it("should add item to cart (new item)", () => {
    const state = cartReducers(initialState, addItemToCart(sampleProduct));

    expect(state.cartItems.length).toBe(1);
    expect(state.cartItems[0]).toEqual({
      ...sampleProduct,
      quantity: 1,
    });
  });

  it("should increase quantity if item already exists", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [sampleCartItem, anotherSampleCartItem],
    };

    const state = cartReducers(stateWithItem, addItemToCart(sampleProduct));

    expect(state.cartItems[0].quantity).toBe(3);
  });

  it("should remove one quantity when removing item", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [sampleCartItem, anotherSampleCartItem],
    };

    const state = cartReducers(
      stateWithItem,
      removeItemFromCart(sampleCartItem),
    );

    expect(state.cartItems[0].quantity).toBe(1);
  });

  it("should remove item completely when quantity reaches 0", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [{ ...sampleCartItem, quantity: 1 }],
    };

    const state = cartReducers(
      stateWithItem,
      removeItemFromCart(sampleCartItem),
    );

    expect(state.cartItems.length).toBe(0);
  });

  it("should clear specific item from cart", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [sampleCartItem],
    };

    const state = cartReducers(
      stateWithItem,
      clearItemFromCart(sampleCartItem),
    );

    expect(state.cartItems.length).toBe(0);
  });

  it("should clear entire cart", () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [sampleCartItem],
    };

    const state = cartReducers(stateWithItems, clearCart());

    expect(state.cartItems.length).toBe(0);
  });
});
