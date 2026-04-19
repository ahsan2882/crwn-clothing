import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../../models/cart.model";
import { CartItemType, Product } from "../../models/product.model";
import { CART_ACTION_TYPES } from "./cart.types";

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    setIsCartOpen: (
      state: CartState,
      { payload }: { payload: { type: string; isCartOpen: boolean } },
    ): CartState => {
      const { type, isCartOpen } = payload;
      switch (type) {
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
          return { ...state, isCartOpen };
        default:
          return state;
      }
    },
    addItemToCart: (
      state: CartState,
      {
        payload,
      }: { payload: { type: string; cartItem: CartItemType | Product } },
    ): CartState => {
      const { type, cartItem } = payload;
      switch (type) {
        case CART_ACTION_TYPES.ADD_ITEM_TO_CART:
          return { ...state, cartItems: addToCart(state.cartItems, cartItem) };
        default:
          return state;
      }
    },
    removeItemFromCart: (
      state: CartState,
      { payload }: { payload: { type: string; cartItem: CartItemType } },
    ): CartState => {
      const { type, cartItem } = payload;
      switch (type) {
        case CART_ACTION_TYPES.REMOVE_ITEM_FROM_CART:
          return {
            ...state,
            cartItems: removeCartItem(state.cartItems, cartItem),
          };
        default:
          return state;
      }
    },
    clearItemFromCart: (
      state: CartState,
      { payload }: { payload: { type: string; cartItem: CartItemType } },
    ): CartState => {
      const { type, cartItem } = payload;
      switch (type) {
        case CART_ACTION_TYPES.CLEAR_ITEM_FROM_CART:
          return {
            ...state,
            cartItems: clearCartItem(state.cartItems, cartItem),
          };
        default:
          return state;
      }
    },
  },
});

export const {
  setIsCartOpen,
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
} = cartReducer.actions;
const { reducer } = cartReducer;
export { reducer as cartReducers };

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

  if (!found) {
    updatedCart.push({ ...productToAdd, quantity: 1 });
  }

  return updatedCart;
};

const removeCartItem = (
  cartItems: CartItemType[],
  cartItem: CartItemType,
): CartItemType[] => {
  const updatedCartItems = cartItems.reduce<CartItemType[]>((acc, item) => {
    if (item.id === cartItem.id) {
      const newQuantity = item.quantity - 1;

      if (newQuantity > 0) {
        acc.push({ ...item, quantity: newQuantity });
      }
    } else {
      acc.push(item);
    }

    return acc;
  }, []);
  return updatedCartItems;
};
const clearCartItem = (
  cartItems: CartItemType[],
  cartItemToClear: CartItemType,
) => cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
