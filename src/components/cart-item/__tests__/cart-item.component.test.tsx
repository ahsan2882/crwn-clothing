import { screen, render } from "@testing-library/react";
import CartItem from "../cart-item.component";

describe("Cart item - rendering", () => {
  const mockCartItem = {
    id: 1,
    name: "Test Product",
    quantity: 2,
    price: 50,
    imageUrl: "https://test.com/image.png",
  };

  it("renders product name", () => {
    render(<CartItem cartItem={mockCartItem} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders quantity and price correctly", () => {
    render(<CartItem cartItem={mockCartItem} />);
    expect(screen.getByText("2 x $50")).toBeInTheDocument();
  });

  it("renders product image with correct src and alt", () => {
    render(<CartItem cartItem={mockCartItem} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://test.com/image.png");
    expect(image).toHaveAttribute("alt", "Test Product");
  });
});
