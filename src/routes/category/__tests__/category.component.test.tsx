import { useParams } from "react-router";
import { Product } from "../../../models/product.model";
import { useAppSelector } from "../../../store/hooks";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import Category from "../category.component";
import { screen } from "@testing-library/react";

jest.mock("../../../components/spinner/spinner.component", () => ({
  __esModule: true,
  default: () => <div role="status" aria-label="loading-spinner" />,
}));

jest.mock("../../../components/product-card/product-card.component", () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => (
    <section aria-label={`product-${product.id}`} />
  ),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
}));

jest.mock("../../../store/hooks", () => ({
  useAppSelector: jest.fn(),
}));

describe("Category", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders spinner when loading", () => {
    (useParams as jest.Mock).mockReturnValue({ category: "hats" });
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce({}) // categoriesMap
      .mockReturnValueOnce(true); // isLoading
    renderWithProviders(<Category />);
    expect(
      screen.getByRole("status", { name: /loading-spinner/i }),
    ).toBeInTheDocument();
  });

  it("renders products for given category", () => {
    (useParams as jest.Mock).mockReturnValue({ category: "hats" });
    const mockCategories = {
      hats: [{ id: 1 }, { id: 2 }],
    };
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockCategories)
      .mockReturnValueOnce(false);
    renderWithProviders(<Category />);
    expect(screen.getByText("HATS")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /product-1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /product-2/i }),
    ).toBeInTheDocument();
  });

  it("handles category case and whitespace correctly", () => {
    (useParams as jest.Mock).mockReturnValue({ category: "  HaTs " });
    const mockCategories = {
      hats: [{ id: 1 }],
    };
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockCategories)
      .mockReturnValueOnce(false);
    renderWithProviders(<Category />);
    expect(screen.getByText("HATS")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /product-1/i }),
    ).toBeInTheDocument();
  });

  it("renders nothing when category param is missing", () => {
    (useParams as jest.Mock).mockReturnValue({ category: undefined });
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce(false);
    renderWithProviders(<Category />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });

  it("renders no products when category does not exist", () => {
    (useParams as jest.Mock).mockReturnValue({ category: "unknown" });
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce(false);
    renderWithProviders(<Category />);
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });

  it("renders correct number of product cards", () => {
    (useParams as jest.Mock).mockReturnValue({ category: "hats" });
    const mockCategories = {
      hats: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockCategories)
      .mockReturnValueOnce(false);
    renderWithProviders(<Category />);
    expect(screen.getAllByRole("region")).toHaveLength(3);
  });
});
