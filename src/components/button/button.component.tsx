import { MouseEventHandler, ReactNode } from "react";
import {
  BaseButton,
  ButtonSpinner,
  GoogleSignInButton,
  InvertedButton,
} from "./button.styles";

export const BUTTON_TYPE_CLASSES = {
  base: "base",
  google: "google-sign-in",
  inverted: "inverted",
} as const;

type ButtonType =
  (typeof BUTTON_TYPE_CLASSES)[keyof typeof BUTTON_TYPE_CLASSES];

interface ButtonProps {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  buttonStyle?: ButtonType;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  className?: string;
}

const getButton = (buttonType: ButtonType = BUTTON_TYPE_CLASSES.base) => {
  return buttonMap[buttonType] ?? BaseButton;
};

const buttonMap = {
  [BUTTON_TYPE_CLASSES.base]: BaseButton,
  [BUTTON_TYPE_CLASSES.google]: GoogleSignInButton,
  [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,
} as const;

export default function Button({
  children,
  type,
  buttonStyle,
  onClickHandler,
  isLoading,
  className,
}: ButtonProps) {
  const CustomButton = getButton(buttonStyle);
  return (
    <CustomButton
      type={type}
      onClick={onClickHandler}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <ButtonSpinner></ButtonSpinner> : children}
    </CustomButton>
  );
}
