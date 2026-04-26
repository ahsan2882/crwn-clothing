import { screen } from "@testing-library/react";
import Checkout from "../checkout.component";
import { useAppSelector } from "../../../store/hooks";
import { renderWithProviders } from "../../../utils/tests/tests.utils";

// ----------------------
// Mocks
// ----------------------
jest.mock("../../../store/hooks", () => ({
  useAppSelector: jest.fn(),
}));

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
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([]) // cartItems
      .mockReturnValueOnce(0); // cartTotal
    renderWithProviders(<Checkout />);
    expect(screen.getByText(/product/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/remove/i)).toBeInTheDocument();
  });

  it("renders empty cart message when no items", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([]) // cartItems
      .mockReturnValueOnce(0); // cartTotal
    renderWithProviders(<Checkout />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart items when present", () => {
    const mockItems = [{ id: 1 }, { id: 2 }];
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockItems)
      .mockReturnValueOnce(50);
    renderWithProviders(<Checkout />);
    expect(
      screen.getByRole("region", { name: /cart-item-1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /cart-item-2/i }),
    ).toBeInTheDocument();
  });

  it("renders total amount correctly", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce(123.456);
    renderWithProviders(<Checkout />);
    expect(screen.getByText("TOTAL: $123.46")).toBeInTheDocument();
  });

  it("renders payment form when total > 0", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce(10);
    renderWithProviders(<Checkout />);
    expect(
      screen.getByRole("region", { name: /payment-form/i }),
    ).toBeInTheDocument();
  });

  it("does not render payment form when total is 0", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce([{ id: 1 }])
      .mockReturnValueOnce(0);
    renderWithProviders(<Checkout />);
    expect(
      screen.queryByRole("region", { name: /payment-form/i }),
    ).not.toBeInTheDocument();
  });

  it("renders correct number of checkout items", () => {
    const mockItems = [{ id: 1 }, { id: 2 }, { id: 3 }];
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockItems)
      .mockReturnValueOnce(30);
    renderWithProviders(<Checkout />);
    expect(screen.getAllByRole("region", { name: /cart-item/i })).toHaveLength(
      3,
    );
  });
});
