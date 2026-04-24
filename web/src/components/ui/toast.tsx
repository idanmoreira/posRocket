import type { HTMLAttributes } from "react";

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
};

export const Toast = ({ className, message, ...props }: ToastProps) => {
  const classes = className ? `ui-toast ${className}` : "ui-toast";

  return (
    <div className={classes} role="status" {...props}>
      {message}
    </div>
  );
};
