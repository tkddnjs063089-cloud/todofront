import { memo, ReactNode, ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "default" | "danger" | "success";
  showOnHover?: boolean;
  active?: boolean;
};

const variants = {
  default: "text-stone-400 dark:text-stone-500 hover:text-orange-500",
  danger: "text-stone-400 dark:text-stone-500 hover:text-red-500",
  success: "text-stone-400 dark:text-stone-500 hover:text-green-500",
};

function IconButton({ children, variant = "default", showOnHover = false, active = false, className = "", ...props }: IconButtonProps) {
  return (
    <button {...props} className={`transition-colors ${variants[variant]} ${showOnHover && !active ? "opacity-0 group-hover:opacity-100" : ""} ${className}`}>
      {children}
    </button>
  );
}

export default memo(IconButton);

