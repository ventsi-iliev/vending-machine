import classes from "./Button.module.scss";

type Props = {
  children: React.ReactNode;
  removeSpacing?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

export default function Button({
  children,
  removeSpacing,
  onClick,
  disabled,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes["button"]}
      onClick={onClick}
      style={
        removeSpacing
          ? {
              margin: 0,
            }
          : {}
      }
    >
      {children}
    </button>
  );
}
