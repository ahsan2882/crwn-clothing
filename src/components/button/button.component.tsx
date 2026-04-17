import { ReactNode } from "react";
import "./button.styles.scss";

const BUTTON_TYPE_CLASSES = {
  google: "google-sign-in",
  inverted: "inverted",
};

interface ButtonProps {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  buttonStyle?: keyof typeof BUTTON_TYPE_CLASSES;
  onClickHandler?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  type,
  buttonStyle,
  onClickHandler,
}: ButtonProps) {
  return (
    <button
      className={`button-container ${buttonStyle ? BUTTON_TYPE_CLASSES[buttonStyle] : ""}`}
      type={type}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}
