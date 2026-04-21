import { ChangeEvent, SubmitEvent, useState } from "react";
import { AuthFormFields } from "../../models/auth-form.model";
import { useAppDispatch } from "../../store/hooks";
import { signUpStart } from "../../store/user/user.actions";
import Button from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import { FormContainerStyle } from "../shared/form.styles";

const defaultFormFields: AuthFormFields = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] =
    useState<AuthFormFields>(defaultFormFields);

  const { fullName, email, password, confirmPassword } = formFields;

  const onSubmitHandler = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !confirmPassword || !fullName) {
      return;
    }
    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }
    dispatch(signUpStart({ email, password, displayName: fullName }));
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
    </FormContainerStyle>
  );
}
