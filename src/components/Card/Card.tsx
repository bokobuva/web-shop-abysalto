import Image from "next/image";

type CardProps = {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  maxDescriptionLength?: number;
};

const DEFAULT_MAX_DESCRIPTION_LENGTH = 100;

const truncateDescription = (
  description: string,
  maxLength: number,
): string => {
  if (description.length <= maxLength) return description;
  return `${description.slice(0, maxLength)}...`;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onClick,
  maxDescriptionLength = DEFAULT_MAX_DESCRIPTION_LENGTH,
}) => {
  const truncatedDescription = truncateDescription(
    description,
    maxDescriptionLength,
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="card cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-900"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-testid="card"
      aria-label={`View details for ${title}`}
    >
      <Image src={image} alt={title} width={100} height={100} />
      <h2 className="mt-2 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {truncatedDescription}
      </p>
    </div>
  );
};
