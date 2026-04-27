import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { fireEvent, screen } from "@testing-library/react";
import { rootReducer } from "../../../store/root.reducer";
import { RootState } from "../../../store/store";
import {
  emailSignInStart,
  googleSignInStart,
} from "../../../store/user/user.actions";
import { renderWithProviders } from "../../../utils/tests/tests.utils";
import SignInForm from "../sign-in-form.component";

describe("SignInForm", () => {
  const renderComponent = (store?: EnhancedStore<RootState>) =>
    renderWithProviders(<SignInForm />, { store });

  const store = configureStore({ reducer: rootReducer });
  const dispatchSpy = jest.spyOn(store, "dispatch");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form elements correctly", () => {
    renderComponent();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in with your email and password"),
    ).toBeInTheDocument();
    const signInButton = screen.getByText("Sign In");
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("type", "submit");
    expect(
      screen.getByRole("button", {
        name: /google sign in/i,
      }),
    ).toBeInTheDocument();
  });

  it("updates email and password inputs", () => {
    renderComponent();
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, {
      target: { name: "email", value: "test@mail.com" },
    });
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "123456" },
    });
    expect(emailInput).toHaveValue("test@mail.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("dispatches emailSignInStart on valid submit", () => {
    renderComponent(store);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        name: "email",
        value: "test@mail.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        name: "password",
        value: "123456",
      },
    });
    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);
    expect(dispatchSpy).toHaveBeenCalledWith(
      emailSignInStart({
        email: "test@mail.com",
        password: "123456",
      }),
    );
  });

  it("does NOT dispatch when email is empty", () => {
    renderComponent(store);
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        name: "password",
        value: "123456",
      },
    });
    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("does NOT dispatch when password is empty", () => {
    renderComponent(store);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        name: "email",
        value: "test@mail.com",
      },
    });
    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("clears form after successful submit", () => {
    renderComponent();
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, {
      target: {
        name: "email",
        value: "test@mail.com",
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        name: "password",
        value: "123456",
      },
    });
    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  it("dispatches googleSignInStart on click", () => {
    renderComponent(store);
    fireEvent.click(
      screen.getByRole("button", {
        name: /google sign in/i,
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(googleSignInStart());
  });
});
