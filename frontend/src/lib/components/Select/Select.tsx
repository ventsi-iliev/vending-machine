import { useCallback, useState } from "react";
import { type InputProps } from "../../types/types";
import classes from "./Select.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = Pick<
  InputProps,
  "id" | "label" | "placeholder" | "value" | "onChange" | "disabled"
> & {
  options: Array<{ id: string; value: string }>;
};

export default function Select({
  id,
  placeholder,
  label,
  value,
  options,
  onChange,
  disabled,
}: Props) {
  const [showDroppdown, setShowDropdown] = useState(false);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setShowDropdown((show) => !show);
    }
  }, [disabled]);

  const ref = useOutsideClick<HTMLDivElement>(
    () => setShowDropdown(false),
    showDroppdown,
  );

  return (
    <div className={classes["select"]} ref={ref}>
      <label htmlFor={id}>{label}</label>
      <div className={classes["select__wrapper"]}>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          onClick={toggleDropdown}
          readOnly
          value={value}
          disabled={disabled}
        />

        <div className={classes["select__wrapper--content"]}>
          <div
            className={classes["select__wrapper--content-inner"]}
            style={{
              display: showDroppdown ? "block" : "none",
            }}
          >
            <ul>
              {options.map((opt) => (
                <li
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                  }}
                >
                  {opt.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
