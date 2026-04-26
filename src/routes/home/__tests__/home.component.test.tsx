import { screen } from "@testing-library/react";
import Home from "../home.component";
import { renderWithProviders } from "../../../utils/tests/tests.utils";

// ----------------------
// Mocks
// ----------------------
jest.mock("../../../components/directory/directory.component", () => ({
  __esModule: true,
  default: () => <div data-testid="directory" />,
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Outlet: () => <div data-testid="outlet" />,
}));

describe("Home", () => {
  it("renders Directory and Outlet", () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId("directory")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});
