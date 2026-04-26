import {
  selectIsCartOpen,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../cart.selector";

describe("cart selectors", () => {
  const mockState = {
    cart: {
      isCartOpen: true,
      cartItems: [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 5, quantity: 3 },
      ],
    },
  } as any;

  it("selectIsCartOpen", () => {
    expect(selectIsCartOpen(mockState)).toBe(true);
  });

  it("selectCartItems", () => {
    expect(selectCartItems(mockState)).toHaveLength(2);
  });

  it("selectCartCount", () => {
    // (2*1 + 3*1)
    expect(selectCartCount(mockState)).toBe(5);
  });

  it("selectCartTotal", () => {
    // (2*10 + 3*5) = 20 + 15 = 35
    expect(selectCartTotal(mockState)).toBe(35);
  });
});
