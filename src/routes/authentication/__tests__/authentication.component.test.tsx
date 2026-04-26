import { render, screen } from "@testing-library/react";
import Authentication from "../authentication.component";

jest.mock("../../../components/sign-in-form/sign-in-form.component", () => ({
  __esModule: true,
  default: () => <section aria-label="sign-in-form" />,
}));

jest.mock("../../../components/sign-up-form/sign-up-form.component", () => ({
  __esModule: true,
  default: () => <section aria-label="sign-up-form" />,
}));

describe("Authentication", () => {
  it("renders both authentication forms", () => {
    render(<Authentication />);

    expect(
      screen.getByRole("region", { name: /sign-in-form/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: /sign-up-form/i }),
    ).toBeInTheDocument();
  });

  it("renders exactly two regions (forms)", () => {
    render(<Authentication />);

    expect(screen.getAllByRole("region")).toHaveLength(2);
  });
});
