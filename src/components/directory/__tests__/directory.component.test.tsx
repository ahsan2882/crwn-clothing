import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import Directory from "../directory.component";

jest.mock("../../directory-item/directory-item.component", () => ({
  __esModule: true,
  default: ({ category }: any) => (
    <div data-testid="directory-item">
      <span>{category.title}</span>
      <span>{category.route}</span>
    </div>
  ),
}));

describe("Directory", () => {
  it("renders all categories", () => {
    renderWithProviders(<Directory />);
    const items = screen.getAllByTestId("directory-item");
    expect(items).toHaveLength(5);
  });

  it("renders correct category titles", () => {
    renderWithProviders(<Directory />);
    expect(screen.getByText("hats")).toBeInTheDocument();
    expect(screen.getByText("jackets")).toBeInTheDocument();
    expect(screen.getByText("sneakers")).toBeInTheDocument();
    expect(screen.getByText("womens")).toBeInTheDocument();
    expect(screen.getByText("mens")).toBeInTheDocument();
  });

  it("passes correct routes to DirectoryItem", () => {
    renderWithProviders(<Directory />);
    expect(screen.getByText("shop/hats")).toBeInTheDocument();
    expect(screen.getByText("shop/jackets")).toBeInTheDocument();
    expect(screen.getByText("shop/sneakers")).toBeInTheDocument();
    expect(screen.getByText("shop/womens")).toBeInTheDocument();
    expect(screen.getByText("shop/mens")).toBeInTheDocument();
  });
});
