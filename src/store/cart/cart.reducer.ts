import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../../models/cart.model";
import { CartItemType, Product } from "../../models/product.model";
import {
  addItemToCart,
  clearItemFromCart,
  removeItemFromCart,
  setIsCartOpen,
} from "./cart.actions";

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setIsCartOpen, (state, { payload }) => {
        state.isCartOpen = payload;
      })
      .addCase(addItemToCart, (state, { payload }) => {
        state.cartItems = addToCart(state.cartItems, payload);
      })
      .addCase(removeItemFromCart, (state, { payload }) => {
        state.cartItems = removeCartItem(state.cartItems, payload);
      })
      .addCase(clearItemFromCart, (state, { payload }) => {
        state.cartItems = clearCartItem(state.cartItems, payload);
      });
  },
});

const { reducer } = cartReducer;
export { reducer as cartReducers };

// ── helpers ──────────────────────────────────────────────────────────────────

const addToCart = (
  cartItems: CartItemType[],
  productToAdd: Product | CartItemType,
): CartItemType[] => {
  let found = false;
  const updatedCart = cartItems.reduce<CartItemType[]>((acc, item) => {
    if (item.id === productToAdd.id) {
      found = true;
      acc.push({ ...item, quantity: item.quantity + 1 });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
  if (!found) updatedCart.push({ ...productToAdd, quantity: 1 });
  return updatedCart;
};

const removeCartItem = (
  cartItems: CartItemType[],
  cartItem: CartItemType,
): CartItemType[] =>
  cartItems.reduce<CartItemType[]>((acc, item) => {
    if (item.id === cartItem.id) {
      const newQuantity = item.quantity - 1;
      if (newQuantity > 0) acc.push({ ...item, quantity: newQuantity });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

const clearCartItem = (
  cartItems: CartItemType[],
  cartItemToClear: CartItemType,
) => cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
