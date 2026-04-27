import { setIsCartOpen } from "../cart/cart.actions";

describe("redux store", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("should initialize store with correct shape", () => {
    const { store } = require("../store");
    const state = store.getState();

    expect(state).toHaveProperty("cart");
    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("category");
  });

  it("should dispatch actions and update state", () => {
    const { store } = require("../store");
    store.dispatch(setIsCartOpen(true));
    const state = store.getState();
    expect(state.cart.isCartOpen).toBe(true);
  });
});
