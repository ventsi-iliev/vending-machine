import classes from "./Grid.module.scss";

type Props = {
  children: React.ReactNode;
  columns: number;
};

export default function Grid({ children, columns }: Props) {
  return (
    <div
      className={classes["grid"]}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}
