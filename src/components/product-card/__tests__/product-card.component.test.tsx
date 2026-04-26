import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { addItemToCart } from "../../../store/cart/cart.actions";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import ProductCard from "../product-card.component";
import { fireEvent, screen } from "@testing-library/react";
import { rootReducer } from "../../../store/root.reducer";
import { RootState } from "../../../store/store";
import { Product } from "../../../models/product.model";

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    name: "Test Product",
    imageUrl: "https://test.com/image.png",
    price: 100,
  };

  const renderComponent = ({
    product,
    store,
  }: {
    product?: Product;
    store?: EnhancedStore<RootState>;
  } = {}) =>
    renderWithProviders(<ProductCard product={product || mockProduct} />, {
      store,
    });

  const store = configureStore({ reducer: rootReducer });
  const dispatchSpy = jest.spyOn(store, "dispatch");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details correctly", () => {
    renderComponent();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders product image with correct attributes", () => {
    renderComponent();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockProduct.imageUrl);
    expect(img).toHaveAttribute("alt", mockProduct.name);
  });

  it("renders Add to cart button", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it("dispatches addItemToCart when button clicked", () => {
    renderComponent({ store });
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToCart(mockProduct));
  });

  it("dispatches multiple times on multiple clicks", () => {
    renderComponent({ store });
    const button = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });

  it("handles missing product fields safely", () => {
    const safeProduct = {
      id: 1,
      name: "",
      imageUrl: "",
      price: 0,
    };
    renderComponent({ product: safeProduct });
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
