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

interface ButtonProps {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  buttonStyle?: string;
  onClickHandler?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) => {
  return {
    [BUTTON_TYPE_CLASSES.base]: BaseButton,
    [BUTTON_TYPE_CLASSES.google]: GoogleSignInButton,
    [BUTTON_TYPE_CLASSES.inverted]: InvertedButton,
  }[buttonType];
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
