import { combineReducers } from "redux";
import { cartReducers } from "./cart/cart.reducer";
import { categoryReducers } from "./categories/category.reducer";
import { userReducers } from "./user/user.reducer";

export const rootReducer = combineReducers({
  user: userReducers,
  category: categoryReducers,
  cart: cartReducers,
});
