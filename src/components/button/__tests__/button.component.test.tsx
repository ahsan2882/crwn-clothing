import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import Button, { BUTTON_TYPE_CLASSES } from "../button.component";

jest.mock("../button.styles", () => ({
  BaseButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }) => (
    <button data-testid="base-button" {...props}>
      {children}
    </button>
  ),
  GoogleSignInButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }) => (
    <button data-testid="google-button" {...props}>
      {children}
    </button>
  ),
  InvertedButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }) => (
    <button data-testid="inverted-button" {...props}>
      {children}
    </button>
  ),
  ButtonSpinner: () => <span data-testid="button-spinner" />,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderButton = (
  props: Partial<React.ComponentProps<typeof Button>> = {},
) => {
  const defaults = { type: "button" as const, children: "Click me" };
  return renderWithProviders(<Button {...defaults} {...props} />);
};

describe("Button - rendering", () => {
  it("renders children when not loading", () => {
    renderButton({ children: "Submit" });
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders BaseButton by default (no buttonStyle prop)", () => {
    renderButton();
    expect(screen.getByTestId("base-button")).toBeInTheDocument();
  });

  it("renders BaseButton when buttonStyle is BUTTON_TYPE_CLASSES.base", () => {
    renderButton({ buttonStyle: BUTTON_TYPE_CLASSES.base });
    expect(screen.getByTestId("base-button")).toBeInTheDocument();
  });

  it("renders GoogleSignInButton when buttonStyle is BUTTON_TYPE_CLASSES.google", () => {
    renderButton({ buttonStyle: BUTTON_TYPE_CLASSES.google });
    expect(screen.getByTestId("google-button")).toBeInTheDocument();
  });

  it("renders InvertedButton when buttonStyle is BUTTON_TYPE_CLASSES.inverted", () => {
    renderButton({ buttonStyle: BUTTON_TYPE_CLASSES.inverted });
    expect(screen.getByTestId("inverted-button")).toBeInTheDocument();
  });

  it("applies the className prop to the button element", () => {
    renderButton({ className: "custom-class" });
    expect(screen.getByTestId("base-button")).toHaveClass("custom-class");
  });

  it("uses BaseButton when buttonStyle is not in map", () => {
    renderWithProviders(<Button buttonStyle={"invalid" as any}>Test</Button>);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });
});

describe("Button - type attribute", () => {
  it.each([["button" as const], ["submit" as const], ["reset" as const]])(
    'sets type="%s" on the underlying element',
    (type) => {
      renderButton({ type });
      const buttonElement = screen.getByTestId("base-button");
      expect(buttonElement).toHaveAttribute("type", type);
    },
  );
});

describe("Button - loading state", () => {
  it("shows ButtonSpinner and hides children when isLoading is true", () => {
    renderButton({ isLoading: true, children: "Click me" });
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("hides ButtonSpinner and shows children when isLoading is false", () => {
    renderButton({ isLoading: false, children: "Click me" });
    expect(screen.queryByTestId("button-spinner")).not.toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("disables the button when isLoading is true", () => {
    renderButton({ isLoading: true });
    expect(screen.getByTestId("base-button")).toBeDisabled();
  });

  it("does not disable the button when isLoading is false", () => {
    renderButton({ isLoading: false });
    expect(screen.getByTestId("base-button")).not.toBeDisabled();
  });

  it("does not disable the button when isLoading is omitted", () => {
    renderButton();
    expect(screen.getByTestId("base-button")).not.toBeDisabled();
  });
});

describe("Button - click handler", () => {
  it("calls onClickHandler when clicked", () => {
    const onClick = jest.fn();
    renderButton({ onClickHandler: onClick });
    fireEvent.click(screen.getByTestId("base-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes the MouseEvent to onClickHandler", () => {
    const onClick = jest.fn();
    renderButton({ onClickHandler: onClick });
    fireEvent.click(screen.getByTestId("base-button"));
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "click" }),
    );
  });

  it("does not throw when onClickHandler is omitted and button is clicked", () => {
    renderButton();
    expect(() =>
      fireEvent.click(screen.getByTestId("base-button")),
    ).not.toThrow();
  });

  it("sets disabled attribute when isLoading is true", () => {
    const onClick = jest.fn();
    renderButton({ onClickHandler: onClick, isLoading: true });
    expect(screen.getByTestId("base-button")).toBeDisabled();
  });
});

describe("Button - memoisation", () => {
  it("renders consistently when re-rendered with the same props", () => {
    const { rerender } = renderWithProviders(
      <Button type="button">Hello</Button>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();

    rerender(<Button type="button">Hello</Button>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("updates correctly when props change", () => {
    const { rerender } = renderWithProviders(
      <Button type="button">Before</Button>,
    );
    expect(screen.getByText("Before")).toBeInTheDocument();

    rerender(<Button type="button">After</Button>);
    expect(screen.getByText("After")).toBeInTheDocument();
    expect(screen.queryByText("Before")).not.toBeInTheDocument();
  });
});
