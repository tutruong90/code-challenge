import type { FC, HTMLProps } from "react";

const LoadingButton: FC<HTMLProps<HTMLButtonElement>> = ({ ...props }) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={props.className}
    >
      {props.children}
    </button>
  );
};

export default LoadingButton;
