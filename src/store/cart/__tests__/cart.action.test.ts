import { CartItemType, Product } from "../../../models/product.model";
import {
  setIsCartOpen,
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  clearCart,
} from "../cart.actions";

describe("cart actions", () => {
  it("setIsCartOpen", () => {
    expect(setIsCartOpen(true)).toEqual({
      type: "cart/SET_IS_CART_OPEN",
      payload: true,
    });
  });

  it("addItemToCart", () => {
    const payload: Product = { id: 1, name: "Hat", imageUrl: "test", price: 1 };
    expect(addItemToCart(payload)).toEqual({
      type: "cart/ADD_ITEM_TO_CART",
      payload,
    });
  });

  it("removeItemFromCart", () => {
    const payload: CartItemType = {
      id: 1,
      name: "Hat",
      quantity: 1,
      imageUrl: "test",
      price: 2,
    };
    expect(removeItemFromCart(payload)).toEqual({
      type: "cart/REMOVE_ITEM_FROM_CART",
      payload,
    });
  });

  it("clearItemFromCart", () => {
    const payload: CartItemType = {
      id: 1,
      name: "Hat",
      quantity: 1,
      imageUrl: "test",
      price: 2,
    };
    expect(clearItemFromCart(payload)).toEqual({
      type: "cart/CLEAR_ITEM_FROM_CART",
      payload,
    });
  });

  it("clearCart", () => {
    expect(clearCart()).toEqual({
      type: "cart/CLEAR_CART",
    });
  });
});
