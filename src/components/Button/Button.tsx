type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  dataTestId: string;
  ariaLabel: string;
  disabled?: boolean;
  variant?: "primary" | "outline";
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  dataTestId,
  ariaLabel,
  disabled = false,
  variant = "primary",
  className,
}) => {
  const baseClasses =
    "cursor-pointer rounded-sm px-6 py-2.5 font-medium tracking-wide uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const variantClasses =
    variant === "outline"
      ? "border border-white text-white hover:bg-white hover:text-black dark:border-neutral-300 dark:text-neutral-300 dark:hover:bg-neutral-100 dark:hover:text-black"
      : "border-0 bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-400 dark:text-black dark:hover:bg-neutral-200";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className ?? ""}`.trim()}
    >
      {children}
    </button>
  );
};
