import { screen } from "@testing-library/react";
import { useAppSelector } from "../../../store/hooks";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import Checkout from "../checkout.component";
import {
  selectCartItems,
  selectCartTotal,
} from "../../../store/cart/cart.selector";

// ----------------------
// Mocks
// ----------------------
jest.mock("../../../store/hooks", () => ({
  useAppSelector: jest.fn(),
}));

const mockSelectors = (items: any[], total: number) => {
  (useAppSelector as jest.Mock).mockImplementation((selector) => {
    if (selector === selectCartItems) return items;
    if (selector === selectCartTotal) return total;
    return undefined;
  });
};

jest.mock("../../../components/checkout-item/checkout-item.component", () => ({
  __esModule: true,
  default: ({ cartItem }: any) => (
    <section aria-label={`cart-item-${cartItem.id}`} />
  ),
}));

jest.mock("../../../components/payment-form/payment-form.component", () => ({
  __esModule: true,
  default: () => <section aria-label="payment-form" />,
}));

describe("Checkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders checkout headers", () => {
    mockSelectors([], 0);
    renderWithProviders(<Checkout />);
    expect(screen.getByText(/product/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  it("renders empty cart message when no items", () => {
    mockSelectors([], 0);
    renderWithProviders(<Checkout />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart items when present", () => {
    const mockItems = [{ id: 1 }, { id: 2 }];
    mockSelectors(mockItems, 50);
    renderWithProviders(<Checkout />);
    expect(
      screen.getByRole("region", { name: /cart-item-1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /cart-item-2/i }),
    ).toBeInTheDocument();
  });

  it("renders total amount correctly", () => {
    mockSelectors([{ id: 1 }], 123.456);
    renderWithProviders(<Checkout />);
    expect(screen.getByText("TOTAL: $123.46")).toBeInTheDocument();
  });

  it("renders payment form when total > 0", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce(10);
    mockSelectors([{ id: 1 }], 10);
    renderWithProviders(<Checkout />);
    expect(
      screen.getByRole("region", { name: /payment-form/i }),
    ).toBeInTheDocument();
  });

  it("does not render payment form when total is 0", () => {
    mockSelectors([{ id: 1 }], 0);
    renderWithProviders(<Checkout />);
    expect(
      screen.queryByRole("region", { name: /payment-form/i }),
    ).not.toBeInTheDocument();
  });

  it("renders correct number of checkout items", () => {
    const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
    mockSelectors(mockItems, 30);
    renderWithProviders(<Checkout />);
    expect(screen.getAllByRole("region", { name: /cart-item/i })).toHaveLength(
      3,
    );
  });
});
