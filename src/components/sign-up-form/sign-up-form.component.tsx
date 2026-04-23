import {
  ChangeEvent,
  memo,
  SubmitEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SignUpFormFields } from "../../models/auth-form.model";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signUpStart } from "../../store/user/user.actions";
import { selectCurrentUser } from "../../store/user/user.selector";
import Button from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import { FormContainerStyle } from "../shared/form.styles";

const defaultFormFields: SignUpFormFields = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default memo(function SignUpForm() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [formFields, setFormFields] =
    useState<SignUpFormFields>(defaultFormFields);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (submittedEmail && currentUser?.email === submittedEmail) {
      setFormFields(defaultFormFields);
      setSubmittedEmail(null);
    }
  }, [currentUser, submittedEmail]);

  const { fullName, email, password, confirmPassword } = formFields;

  const onSubmitHandler = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email || !password || !confirmPassword || !fullName) {
        return;
      }
      if (password !== confirmPassword) {
        alert("passwords do not match");
        return;
      }
      dispatch(signUpStart({ email, password, displayName: fullName }));
      setSubmittedEmail(email);
    },
    [confirmPassword, dispatch, email, fullName, password],
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
  const fullNameInputOptions = useMemo(
    () => ({
      inputName: "fullName",
      value: fullName,
      onChangeHandler,
      inputType: "text" as const,
    }),
    [fullName, onChangeHandler],
  );

  const confirmPasswordInputOptions = useMemo(
    () => ({
      inputName: "confirmPassword",
      value: confirmPassword,
      onChangeHandler,
      inputType: "password" as const,
    }),
    [confirmPassword, onChangeHandler],
  );
  return (
    <FormContainerStyle>
      <h2>Don't have an account?</h2>
      <span>Sign up with email and password</span>
      <form onSubmit={onSubmitHandler}>
        <FormInput label="Full Name" inputOptions={fullNameInputOptions} />
        <FormInput label="Email" inputOptions={emailInputOptions} />
        <FormInput label="Password" inputOptions={passwordInputOptions} />
        <FormInput
          label="Confirm Password"
          inputOptions={confirmPasswordInputOptions}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </FormContainerStyle>
  );
});
