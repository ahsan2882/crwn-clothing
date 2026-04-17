import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CartItemType, Product } from "../models/product.model";

type CartContextType = {
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  cartItems: CartItemType[];
  addItemToCart: (product: Product | CartItemType) => void;
  removeItemFromCart: (cartItem: CartItemType) => void;
  cartCount: number;
  cartTotal: number;
  clearItemFromCart: (cartItem: CartItemType) => void;
};

const defaultCartContext: CartContextType = {
  isCartOpen: false,
  setIsCartOpen: () => false,
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0,
};

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

export const CartContext = createContext<CartContextType>(defaultCartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0,
    );
    const newCartTotal = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0,
    );
    setCartCount(newCartCount);
    setCartTotal(newCartTotal);
  }, [cartItems]);
  const addItemToCart = (productToAdd: Product) => {
    const newCartItems = addToCart(cartItems, productToAdd);
    setCartItems(newCartItems);
  };
  const removeItemFromCart = (cartItem: CartItemType): void => {
    const updatedCartItems = removeCartItem(cartItems, cartItem);
    setCartItems(updatedCartItems);
  };
  const clearItemFromCart = (cartItem: CartItemType) => {
    setCartItems(clearCartItem(cartItems, cartItem));
  };
  const value = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addItemToCart,
    cartCount,
    removeItemFromCart,
    cartTotal,
    clearItemFromCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
