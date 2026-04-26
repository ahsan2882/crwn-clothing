import { rootReducer } from "../root.reducer";

describe("root reducer", () => {
  it("should initialize all slices with default state", () => {
    const state = rootReducer(undefined, { type: "UNKNOWN" });

    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("category");
    expect(state).toHaveProperty("cart");
  });

  it("should delegate action to correct slice (cart)", () => {
    const state = rootReducer(undefined, {
      type: "cart/SET_IS_CART_OPEN",
      payload: true,
    });

    expect(state.cart.isCartOpen).toBe(true);
  });

  it("should delegate action to correct slice (category)", () => {
    const state = rootReducer(undefined, {
      type: "category/fetchCategoriesStart",
    });

    expect(state.category.isLoading).toBe(true);
  });

  it("should delegate action to correct slice (user)", () => {
    const state = rootReducer(undefined, {
      type: "user/CHECK_USER_SESSION",
    });

    expect(state.user.isLoading).toBe(true);
  });
});
