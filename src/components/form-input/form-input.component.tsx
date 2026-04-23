import { ChangeEvent, memo } from "react";
import { FormInputField, FormInputLabel, Group } from "./form-input.styles";

interface FormInputProps {
  label: string;
  inputOptions: {
    inputName: string;
    value: string;
    inputType: string;
    onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  };
}

export default memo(function FormInput({
  label,
  inputOptions,
}: FormInputProps) {
  const { inputName, value, inputType, onChangeHandler } = inputOptions;

  return (
    <Group>
      <FormInputField
        id={inputName}
        required
        type={inputType}
        name={inputName}
        onChange={onChangeHandler}
        value={value}
      />
      {label && (
        <FormInputLabel $shrink={!!value} htmlFor={inputName}>
          {label}
        </FormInputLabel>
      )}
    </Group>
  );
});
