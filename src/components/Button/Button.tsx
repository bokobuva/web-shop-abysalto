type ButtonProps = {
  label: string;
  onClick: () => void;
  dataTestId: string;
  ariaLabel: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  label,
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
      className="rounded px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
};
