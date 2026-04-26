import {
  ChangeEvent,
  memo,
  SubmitEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SignInFormFields } from "../../models/auth-form.model";
import { useAppDispatch } from "../../store/hooks";
import {
  emailSignInStart,
  googleSignInStart,
} from "../../store/user/user.actions";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import { FormContainerStyle } from "../shared/form.styles";
import { ButtonsContainer } from "./sign-in-form.styles";

const defaultFormFields: SignInFormFields = {
  email: "",
  password: "",
};

export default memo(function SignInForm() {
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] =
    useState<SignInFormFields>(defaultFormFields);

  const { email, password } = formFields;

  const signInWithGoogle = useCallback(async () => {
    dispatch(googleSignInStart());
  }, [dispatch]);

  const resetFormFields = useCallback(() => {
    setFormFields(defaultFormFields);
  }, []);

  const onSubmitHandler = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email || !password) return;
      dispatch(emailSignInStart({ email, password }));
      resetFormFields();
    },
    [dispatch, email, password, resetFormFields],
  );

  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormFields({ ...formFields, [name]: value });
    },
    [formFields],
  );
  const emailInputOptions = useMemo(
    () => ({
      inputName: "email",
      value: email,
      onChangeHandler,
      inputType: "email" as const,
    }),
    [email, onChangeHandler],
  );

  const passwordInputOptions = useMemo(
    () => ({
      inputName: "password",
      value: password,
      onChangeHandler,
      inputType: "password" as const,
    }),
    [password, onChangeHandler],
  );
  return (
    <FormContainerStyle>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={onSubmitHandler}>
        <FormInput label="Email" inputOptions={emailInputOptions} />
        <FormInput label="Password" inputOptions={passwordInputOptions} />
        <ButtonsContainer>
          <Button type="submit">Sign In</Button>
          <Button
            buttonStyle={BUTTON_TYPE_CLASSES.google}
            onClickHandler={signInWithGoogle}
          >
            Google sign in
          </Button>
        </ButtonsContainer>
      </form>
    </FormContainerStyle>
  );
});
