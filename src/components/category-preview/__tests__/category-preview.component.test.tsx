import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import CategoryPreview from "../category-preview.component";

jest.mock("../../product-card/product-card.component", () => ({
  __esModule: true,
  default: ({ product }: any) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

describe("CategoryPreview", () => {
  const mockProducts = [
    { id: 1, name: "P1" },
    { id: 2, name: "P2" },
    { id: 3, name: "P3" },
    { id: 4, name: "P4" },
    { id: 5, name: "P5" },
  ] as any;

  it("renders category title in uppercase", () => {
    renderWithProviders(
      <CategoryPreview title="Hats" products={mockProducts} />,
    );
    expect(screen.getByText("HATS")).toBeInTheDocument();
  });

  it("renders correct link path (lowercase title)", () => {
    renderWithProviders(
      <CategoryPreview title="Hats" products={mockProducts} />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/hats");
  });

  it("renders only first 4 products", () => {
    renderWithProviders(
      <CategoryPreview title="Hats" products={mockProducts} />,
    );
    const cards = screen.getAllByTestId("product-card");
    expect(cards).toHaveLength(4);
  });

  it("renders product names correctly inside ProductCard", () => {
    renderWithProviders(
      <CategoryPreview title="Hats" products={mockProducts} />,
    );
    expect(screen.getByText("P1")).toBeInTheDocument();
    expect(screen.getByText("P2")).toBeInTheDocument();
    expect(screen.getByText("P3")).toBeInTheDocument();
    expect(screen.getByText("P4")).toBeInTheDocument();
    // 5th should NOT render
    expect(screen.queryByText("P5")).not.toBeInTheDocument();
  });
});
