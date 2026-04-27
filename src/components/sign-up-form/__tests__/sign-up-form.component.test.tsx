import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { User } from "firebase/auth";
import { rootReducer } from "../../../store/root.reducer";
import { signUpStart } from "../../../store/user/user.actions";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import SignUpForm from "../sign-up-form.component";

jest.mock("../../form-input/form-input.component", () => ({
  __esModule: true,
  default: ({ label, inputOptions }: any) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={inputOptions.inputName}
        name={inputOptions.inputName}
        value={inputOptions.value}
        onChange={inputOptions.onChangeHandler}
        type={inputOptions.inputType}
      />
    </div>
  ),
}));
global.alert = jest.fn();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    user: {
      currentUser: { email: "john@test.com" } as User,
      isLoading: false,
      hasLoaded: true,
      error: null,
    },
  },
});
const dispatchSpy = jest.spyOn(store, "dispatch") as jest.Mock;

describe("SignUpForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form correctly", () => {
    renderWithProviders(<SignUpForm />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(
      screen.getByText("Sign up with email and password"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("fullName")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("confirmPassword")).toBeInTheDocument();
  });

  it("updates form state on input change", () => {
    renderWithProviders(<SignUpForm />);
    fireEvent.change(screen.getByTestId("fullName"), {
      target: { name: "fullName", value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { name: "email", value: "john@test.com" },
    });
    expect(screen.getByTestId("fullName")).toHaveValue("John Doe");
    expect(screen.getByTestId("email")).toHaveValue("john@test.com");
  });

  it("does not dispatch if fields are empty", () => {
    renderWithProviders(<SignUpForm />, { store });
    fireEvent.submit(screen.getByRole("button"));
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("shows alert when passwords do not match", () => {
    renderWithProviders(<SignUpForm />, { store });
    fireEvent.change(screen.getByTestId("fullName"), {
      target: { name: "fullName", value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { name: "email", value: "john@test.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { name: "confirmPassword", value: "999999" },
    });
    fireEvent.submit(screen.getByRole("button"));
    expect(global.alert).toHaveBeenCalledWith("passwords do not match");
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("dispatches signUpStart on valid submit", () => {
    renderWithProviders(<SignUpForm />, { store });
    fireEvent.change(screen.getByTestId("fullName"), {
      target: { name: "fullName", value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { name: "email", value: "john@test.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { name: "confirmPassword", value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      signUpStart({
        email: "john@test.com",
        password: "123456",
        displayName: "John Doe",
      }),
    );
  });

  it("resets form when currentUser matches submitted email", () => {
    renderWithProviders(<SignUpForm />, { store });
    fireEvent.change(screen.getByTestId("fullName"), {
      target: { name: "fullName", value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { name: "email", value: "john@test.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { name: "password", value: "123456" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { name: "confirmPassword", value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button"));
    expect(screen.getByTestId("fullName")).toHaveValue("");
    expect(screen.getByTestId("email")).toHaveValue("");
    expect(screen.getByTestId("password")).toHaveValue("");
    expect(screen.getByTestId("confirmPassword")).toHaveValue("");
  });
});
