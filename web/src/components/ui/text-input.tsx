import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({ className, type = "text", ...props }: TextInputProps) => {
  const classes = className ? `ui-text-input ${className}` : "ui-text-input";

  return <input className={classes} type={type} {...props} />;
};
