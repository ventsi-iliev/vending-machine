import type { InputProps } from "../../types/types";
import classes from "./Input.module.scss";

export default function Input({
  id,
  placeholder,
  label,
  type = "text",
  value,
  onChange,
  helperText,
  disabled,
}: InputProps) {
  return (
    <div className={classes["input-group"]}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        disabled={disabled}
      />

      {helperText && <small>{helperText}</small>}
    </div>
  );
}
