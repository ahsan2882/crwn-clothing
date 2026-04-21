import { createAction } from "@reduxjs/toolkit";
import { CartItemType, Product } from "../../models/product.model";

export const setIsCartOpen = createAction<boolean>("cart/SET_IS_CART_OPEN");
export const addItemToCart = createAction<CartItemType | Product>(
  "cart/ADD_ITEM_TO_CART",
);
export const removeItemFromCart = createAction<CartItemType>(
  "cart/REMOVE_ITEM_FROM_CART",
);
export const clearItemFromCart = createAction<CartItemType>(
  "cart/CLEAR_ITEM_FROM_CART",
);
