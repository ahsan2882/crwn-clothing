export interface AuthFormFields {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignInFormFields {
  email: string;
  password: string;
}

export interface SignUpFormFields extends SignInFormFields {
  fullName: string;
  confirmPassword: string;
}
