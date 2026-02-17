type ButtonProps = {
  label: string;
  onClick: () => void;
  dataTestId: string;
  ariaLabel: string;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  dataTestId,
  ariaLabel,
}) => {
  return (
    <button onClick={onClick} data-testid={dataTestId} aria-label={ariaLabel}>
      {label}
    </button>
  );
};
