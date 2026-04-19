import { createSelector } from "@reduxjs/toolkit";
import { CartState } from "../../models/cart.model";

const cartState = (state: { cart: CartState }) => state.cart;

export const selectIsCartOpen = createSelector(
  [cartState],
  (cart) => cart.isCartOpen,
);

export const selectCartItems = createSelector(
  [cartState],
  (cart) => cart.cartItems,
);

export const selectCartCount = createSelector([cartState], (cart) =>
  cart.cartItems.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotal = createSelector([cartState], (cart) =>
  cart.cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
);
