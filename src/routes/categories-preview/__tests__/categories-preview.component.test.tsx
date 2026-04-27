import { screen } from "@testing-library/react";
import { useAppSelector } from "../../../store/hooks";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import CategoriesPreview from "../categories-preview.component";

jest.mock("../../../store/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock(
  "../../../components/category-preview/category-preview.component",
  () => ({
    __esModule: true,
    default: ({ title }: any) => <section aria-label={`category-${title}`} />,
  }),
);

jest.mock("../../../components/spinner/spinner.component", () => ({
  __esModule: true,
  default: () => <div role="status" aria-label="loading-spinner" />,
}));

describe("CategoriesPreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------
  // Loading state
  // ----------------------
  it("renders spinner when loading", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce({}) // categoriesMap
      .mockReturnValueOnce(true); // isLoading

    renderWithProviders(<CategoriesPreview />);

    expect(
      screen.getByRole("status", { name: /loading-spinner/i }),
    ).toBeInTheDocument();
  });

  it("renders category previews when not loading", () => {
    const mockCategories = {
      hats: [{ id: 1 }],
      jackets: [{ id: 2 }],
    };
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockCategories) // categoriesMap
      .mockReturnValueOnce(false); // isLoading
    renderWithProviders(<CategoriesPreview />);
    expect(
      screen.getByRole("region", { name: /category-hats/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /category-jackets/i }),
    ).toBeInTheDocument();
  });

  it("renders correct number of category previews", () => {
    const mockCategories = {
      hats: [{ id: 1 }],
      jackets: [{ id: 2 }],
      sneakers: [{ id: 3 }],
    };
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce(mockCategories)
      .mockReturnValueOnce(false);
    renderWithProviders(<CategoriesPreview />);
    expect(screen.getAllByRole("region")).toHaveLength(3);
  });

  it("renders nothing when no categories exist", () => {
    (useAppSelector as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce(false);
    renderWithProviders(<CategoriesPreview />);
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });
});
