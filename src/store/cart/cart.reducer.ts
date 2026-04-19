import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../../models/cart.model";
import { CartItemType, Product } from "../../models/product.model";

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    setIsCartOpen: (state: CartState, { payload }: PayloadAction<boolean>) => {
      return { ...state, isCartOpen: payload };
    },
    addItemToCart: (
      state: CartState,
      { payload }: PayloadAction<CartItemType | Product>,
    ) => {
      return { ...state, cartItems: addToCart(state.cartItems, payload) };
    },
    removeItemFromCart: (
      state: CartState,
      { payload }: PayloadAction<CartItemType>,
    ) => {
      return { ...state, cartItems: removeCartItem(state.cartItems, payload) };
    },
    clearItemFromCart: (
      state: CartState,
      { payload }: PayloadAction<CartItemType>,
    ) => {
      return { ...state, cartItems: clearCartItem(state.cartItems, payload) };
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
