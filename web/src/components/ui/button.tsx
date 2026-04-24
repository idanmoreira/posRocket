import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = ({ children, className, type = "button", ...props }: ButtonProps) => {
  const classes = className ? `ui-button ${className}` : "ui-button";

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
};
