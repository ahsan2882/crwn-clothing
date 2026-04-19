import { FirebaseError } from "firebase/app";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { AuthFormFields } from "../../models/auth-form.model";
import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from "../../utils/firebase/firebase.utils";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import { FormContainerStyle } from "../shared/form.styles";
import { ButtonsContainer } from "./sign-in-form.styles";

const defaultFormFields: AuthFormFields = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const [formFields, setFormFields] =
    useState<AuthFormFields>(defaultFormFields);

  const { email, password } = formFields;

  const signInWithGoogle = async () => {
    try {
      await signInWithGooglePopup();
    } catch (error) {
      console.error("Google sign-in failed", error);
    }
  };

  const onSubmitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      switch (error instanceof FirebaseError && error.code) {
        case "auth/invalid-credential":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user associated with this email");
          break;
        default:
          console.log(error);
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
    <FormContainerStyle>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={onSubmitHandler}>
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
        <ButtonsContainer>
          <Button type="submit">Sign In</Button>
          <Button
            type="button"
            buttonStyle={BUTTON_TYPE_CLASSES.google}
            onClickHandler={signInWithGoogle}
          >
            Google sign in
          </Button>
        </ButtonsContainer>
      </form>
    </FormContainerStyle>
  );
}
