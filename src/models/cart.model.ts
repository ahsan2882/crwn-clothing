import { CartItemType } from "./product.model";

export interface CartState {
  isCartOpen: boolean;
  cartItems: CartItemType[];
  //   cartCount: number;
  //   cartTotal: number;
}
