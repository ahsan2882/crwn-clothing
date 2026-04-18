import {
  createContext,
  // Dispatch,
  ReactNode,
  // SetStateAction,
  useEffect,
  useReducer,
  // useState,
} from "react";
import { CartItemType, Product } from "../models/product.model";

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (state: boolean) => void;
  cartItems: CartItemType[];
  addItemToCart: (product: Product | CartItemType) => void;
  removeItemFromCart: (cartItem: CartItemType) => void;
  cartCount: number;
  cartTotal: number;
  clearItemFromCart: (cartItem: CartItemType) => void;
}

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

type CartAction =
  | { type: "SET_IS_CART_OPEN"; payload: boolean }
  | { type: "SET_CART_ITEMS"; payload: CartItemType[] }
  | { type: "SET_CART_COUNT"; payload: number }
  | { type: "SET_CART_TOTAL"; payload: number };

type CartState = Pick<
  CartContextType,
  "isCartOpen" | "cartCount" | "cartItems" | "cartTotal"
>;

export const CART_ACTION_TYPES = {
  SET_IS_CART_OPEN: "SET_IS_CART_OPEN",
  SET_CART_ITEMS: "SET_CART_ITEMS",
  SET_CART_COUNT: "SET_CART_COUNT",
  SET_CART_TOTAL: "SET_CART_TOTAL",
} as const;

const INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

const cartReducer = (state: CartState, action: CartAction) => {
  const { type, payload } = action;
  switch (type) {
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return { ...state, isCartOpen: payload };
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return { ...state, cartItems: payload };
    case CART_ACTION_TYPES.SET_CART_COUNT:
      return { ...state, cartCount: payload };
    case CART_ACTION_TYPES.SET_CART_TOTAL:
      return { ...state, cartTotal: payload };
    default:
      throw new Error(`Unhandled type ${type} in cartReducer`);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  // const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  // const [cartCount, setCartCount] = useState<number>(0);
  // const [cartTotal, setCartTotal] = useState<number>(0);

  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const { isCartOpen, cartItems, cartCount, cartTotal } = state;
  const setCartCount = (newCartCount: number) => {
    dispatch({ type: CART_ACTION_TYPES.SET_CART_COUNT, payload: newCartCount });
  };
  const setCartTotal = (newCartTotal: number) => {
    dispatch({ type: CART_ACTION_TYPES.SET_CART_TOTAL, payload: newCartTotal });
  };
  const setIsCartOpen = (cartOpened: boolean) => {
    dispatch({ type: CART_ACTION_TYPES.SET_IS_CART_OPEN, payload: cartOpened });
  };
  const setCartItems = (newCartItems: CartItemType[]) => {
    dispatch({ type: CART_ACTION_TYPES.SET_CART_ITEMS, payload: newCartItems });
  };
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
