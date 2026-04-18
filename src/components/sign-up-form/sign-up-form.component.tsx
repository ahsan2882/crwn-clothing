import { ChangeEvent, useState, SubmitEvent, useContext } from "react";
import { AuthFormFields } from "../../models/auth-form.model";
import { SignUpContainer } from "./sign-up-form.styles";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import { FirebaseError } from "firebase/app";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { UserContext } from "../../contexts/user.context";

const defaultFormFields: AuthFormFields = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function SignUpForm() {
  const [formFields, setFormFields] =
    useState<AuthFormFields>(defaultFormFields);
  const { setCurrentUser } = useContext(UserContext);

  const { fullName, email, password, confirmPassword } = formFields;

  const onSubmitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }
    try {
      const response = await createAuthUserWithEmailAndPassword(
        email,
        password,
      );
      if (response) {
        const { user } = response;

        await createUserDocumentFromAuth(user, { displayName: fullName });
        resetFormFields();
        setCurrentUser(user);
      }
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        alert("cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignUpContainer>
      <h2>Don't have an account?</h2>
      <span>Sign up with email and password</span>
      <form onSubmit={onSubmitHandler}>
        <FormInput
          label="Full Name"
          inputOptions={{
            inputName: "fullName",
            value: fullName || "",
            onChangeHandler: onChangeHandler,
            inputType: "text",
          }}
        />
        <FormInput
          label="Email"
          inputOptions={{
            inputName: "email",
            value: email,
            onChangeHandler: onChangeHandler,
            inputType: "email",
          }}
        />
        <FormInput
          label="Password"
          inputOptions={{
            inputName: "password",
            value: password,
            onChangeHandler: onChangeHandler,
            inputType: "password",
          }}
        />
        <FormInput
          label="Confirm Password"
          inputOptions={{
            inputName: "confirmPassword",
            value: confirmPassword || "",
            onChangeHandler: onChangeHandler,
            inputType: "password",
          }}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </SignUpContainer>
  );
}
