type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  dataTestId: string;
  ariaLabel: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  dataTestId,
  ariaLabel,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white transition duration-100 ease-in-out hover:enabled:scale-[1.08] hover:enabled:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      {children}
    </button>
  );
};
