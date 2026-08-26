import classes from "./Container.module.scss";

type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return <section className={classes["container"]}>{children}</section>;
}
