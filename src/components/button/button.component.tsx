import { ReactNode } from "react";
import {
  BaseButton,
  GoogleSignInButton,
  InvertedButton,
} from "./button.styles";

export const BUTTON_TYPE_CLASSES = {
  base: "base",
  google: "google-sign-in",
  inverted: "inverted",
};

type ButtonType =
  (typeof BUTTON_TYPE_CLASSES)[keyof typeof BUTTON_TYPE_CLASSES];

interface ButtonProps {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  buttonStyle?: ButtonType;
  onClickHandler?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) => {
  const buttonMap = {
    [BUTTON_TYPE_CLASSES.base]: BaseButton,
    [BUTTON_TYPE_CLASSES.google]: GoogleSignInButton,
    [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,
  };
  return buttonMap[buttonType] ?? BaseButton;
};

export default function Button({
  children,
  type,
  buttonStyle,
  onClickHandler,
}: ButtonProps) {
  const CustomButton = getButton(buttonStyle);
  return (
    <CustomButton type={type} onClick={onClickHandler}>
      {children}
    </CustomButton>
  );
}
