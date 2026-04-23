export interface SignInFormFields {
  email: string;
  password: string;
}

export interface SignUpFormFields extends SignInFormFields {
  fullName: string;
  confirmPassword: string;
}
