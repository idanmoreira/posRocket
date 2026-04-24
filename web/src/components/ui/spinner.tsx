import type { HTMLAttributes } from "react";

type SpinnerProps = HTMLAttributes<HTMLSpanElement>;

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  const classes = className ? `ui-spinner ${className}` : "ui-spinner";

  return <span className={classes} {...props} />;
};
