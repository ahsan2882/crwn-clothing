import { renderWithProviders } from "../../../utils/tests/tests.utils";
import DirectoryItem from "../directory-item.component";
import { fireEvent, screen } from "@testing-library/react";

// ---- mock useNavigate correctly ----
const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("DirectoryItem", () => {
  const mockCategory = {
    id: 1,
    title: "Hats",
    imageUrl: "https://test.com/image.png",
    route: "/shop/hats",
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders title and static text", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    expect(screen.getByText("Hats")).toBeInTheDocument();
    expect(screen.getByText("Shop now!")).toBeInTheDocument();
  });

  it("renders container as accessible button", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("tabIndex", "0");
  });

  it("navigates on click", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/shop/hats");
  });

  it("navigates on Enter key press", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    fireEvent.keyDown(screen.getByRole("button"), {
      key: "Enter",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/shop/hats");
  });

  it("navigates on Space key press", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    fireEvent.keyDown(screen.getByRole("button"), {
      key: " ",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/shop/hats");
  });

  it("does NOT navigate on other keys", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    fireEvent.keyDown(screen.getByRole("button"), {
      key: "Escape",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("calls navigate only once per interaction", () => {
    renderWithProviders(<DirectoryItem category={mockCategory} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
