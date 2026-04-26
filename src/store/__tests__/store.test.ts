import { setIsCartOpen } from "../cart/cart.actions";
import { store } from "../store";

describe("redux store", () => {
  it("should initialize store with correct shape", () => {
    const state = store.getState();

    expect(state).toHaveProperty("cart");
    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("category");
  });

  it("should dispatch actions and update state", () => {
    store.dispatch(setIsCartOpen(true));

    const state = store.getState();

    expect(state.cart.isCartOpen).toBe(true);
  });
});
