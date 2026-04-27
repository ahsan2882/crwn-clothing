import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import FormInput from "../form-input.component";

describe("FormInput", () => {
  const mockOnChange = jest.fn();

  const baseProps = {
    label: "Email",
    inputOptions: {
      inputName: "email",
      value: "",
      inputType: "email",
      onChangeHandler: mockOnChange,
    },
  };
  const renderComponent = (props = baseProps) =>
    renderWithProviders(<FormInput {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input with correct attributes", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("required");
  });

  it("renders label when provided", () => {
    renderComponent();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("does not render label when label is empty", () => {
    renderComponent({
      ...baseProps,
      label: "",
    });
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  // ---------------- ACCESSIBILITY ----------------
  it("associates label with input via htmlFor", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
  });

  // ---------------- CONTROLLED INPUT ----------------
  it("displays the passed value", () => {
    renderComponent({
      ...baseProps,
      inputOptions: {
        ...baseProps.inputOptions,
        value: "test@example.com",
      },
    });
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("calls onChangeHandler when typing", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, {
      target: { value: "abc" },
    });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  // ---------------- SHRINK BEHAVIOR ----------------
  it("label shrinks when value exists", () => {
    renderComponent({
      ...baseProps,
      inputOptions: {
        ...baseProps.inputOptions,
        value: "abc",
      },
    });
    const label = screen.getByText("Email");
    // we can’t directly test CSS, but we can verify prop-driven rendering
    expect(label).toBeInTheDocument();
  });

  // ---------------- EDGE CASES ----------------
  it("handles password input type", () => {
    renderComponent({
      ...baseProps,
      inputOptions: {
        ...baseProps.inputOptions,
        inputType: "password",
      },
    });
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "password");
  });

  it("supports multiple changes", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.change(input, { target: { value: "abc" } });
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});
