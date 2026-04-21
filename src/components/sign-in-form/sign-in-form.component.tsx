import { ChangeEvent, SubmitEvent, useState } from "react";
import { AuthFormFields } from "../../models/auth-form.model";
import { useAppDispatch } from "../../store/hooks";
import {
  emailSignInStart,
  googleSignInStart,
} from "../../store/user/user.actions";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import { FormContainerStyle } from "../shared/form.styles";
import { ButtonsContainer } from "./sign-in-form.styles";

const defaultFormFields: AuthFormFields = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] =
    useState<AuthFormFields>(defaultFormFields);

  const { email, password } = formFields;

  const signInWithGoogle = async () => {
    dispatch(googleSignInStart());
  };

  const onSubmitHandler = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;
    dispatch(emailSignInStart({ email, password }));
    resetFormFields();
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
