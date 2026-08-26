import classes from "./Button.module.scss";

type Props = {
  children: React.ReactNode;
  removeSpacing?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  removeSpacing,
  onClick,
  disabled,
}: Props) {
  return (
    <button
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
