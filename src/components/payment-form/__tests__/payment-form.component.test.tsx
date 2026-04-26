import { User } from "firebase/auth";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import PaymentForm from "../payment-form.component";
import { fireEvent, screen, waitFor } from "@testing-library/react";

const mockConfirmCardPayment = jest.fn();
const mockGetElement = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@stripe/react-stripe-js", () => ({
  ...jest.requireActual("@stripe/react-stripe-js"),
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => ({
    confirmCardPayment: mockConfirmCardPayment,
  }),
  useElements: () => ({
    getElement: mockGetElement,
  }),
}));

global.fetch = jest.fn();
global.alert = jest.fn();

describe("Payment Form", () => {
  const mockCartItems = [
    { id: 1, quantity: 2, price: 100, name: "Test", imageUrl: "test" },
  ];

  const mockUser: User = {
    displayName: "Ahsan",
  } as User;

  it("renders payment form elements", () => {
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    expect(screen.getByText("Credit card payment:")).toBeInTheDocument();
    expect(screen.getByTestId("card-element")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /pay now/i }),
    ).toBeInTheDocument();
  });

  it("does nothing if stripe or elements are missing", async () => {
    mockGetElement.mockReturnValue(null);

    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("completes payment successfully", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    mockConfirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });
    const { store } = renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalled();
    });
    expect(global.alert).toHaveBeenCalledWith("payment successful");
    expect(store.getState().cart.cartItems).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith("/shop");
  });

  it("shows error if stripe fails", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    mockConfirmCardPayment.mockResolvedValue({
      error: { message: "Card declined" },
    });
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Card declined");
    });
  });

  it("handles backend failure", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Unable to create payment intent",
      );
    });
  });

  it("handles unexpected error", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Network error");
    });
  });

  it("sets loading state during payment", async () => {
    mockGetElement.mockReturnValue("card");
    let resolveFetch: any;
    (fetch as jest.Mock).mockReturnValue(
      new Promise((res) => {
        resolveFetch = res;
      }),
    );
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    resolveFetch({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("uses 'Guest' as billing name when no user", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    mockConfirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: null,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalled();
    });
    expect(mockConfirmCardPayment).toHaveBeenCalledWith(
      "secret",
      expect.objectContaining({
        payment_method: expect.objectContaining({
          billing_details: {
            name: "Guest",
          },
        }),
      }),
    );
  });

  it("executes success block: alert + clearCart + navigate", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    mockConfirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });
    const { store } = renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("payment successful");
    });
    expect(store.getState().cart.cartItems).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith("/shop");
  });

  it("handles unknown error (non-Error) in catch block", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockRejectedValue("some weird error");
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Payment failed");
    });
  });

  it("covers succeeded paymentIntent branch", async () => {
    mockGetElement.mockReturnValue("card");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        paymentIntent: { client_secret: "secret" },
      }),
    });
    mockConfirmCardPayment.mockResolvedValue({
      paymentIntent: {
        status: "succeeded",
      },
    });
    renderWithProviders(<PaymentForm />, {
      preloadedState: {
        cart: { cartItems: mockCartItems, isCartOpen: true },
        user: {
          currentUser: mockUser,
          isLoading: false,
          hasLoaded: true,
          error: null,
        },
      },
    });
    fireEvent.submit(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockConfirmCardPayment).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("payment successful");
    });
  });
});
