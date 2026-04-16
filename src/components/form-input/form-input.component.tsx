import "./form-input.styles.scss";
interface FormInputProps {
  label: string;
  inputOptions: {
    inputName: string;
    value: string;
    inputType: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export default function FormInput({ label, inputOptions }: FormInputProps) {
  const { inputName, value, inputType, onChangeHandler } = inputOptions;

  return (
    <div className="group">
      <input
        className="form-input"
        id={inputName}
        required
        type={inputType}
        name={inputName}
        onChange={onChangeHandler}
        value={value}
      />
      {label && (
        <label
          htmlFor={inputName}
          className={`${inputType || inputName || value ? "shrink" : ""} form-input-label`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
