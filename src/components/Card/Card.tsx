import Image from "next/image";

import { Button } from "../Button";

type CardProps = {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  maxDescriptionLength?: number;
  id?: string;
};

const DEFAULT_MAX_DESCRIPTION_LENGTH = 250;

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
  id,
}) => {
  const truncatedDescription = truncateDescription(
    description,
    maxDescriptionLength,
  );
  const titleId = id
    ? `card-title-${id}`
    : `card-title-${title.replace(/\s+/g, "-")}`;

  return (
    <article
      className="card rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      data-testid="card"
      aria-labelledby={titleId}
    >
      <Image src={image} alt={title} width={100} height={100} />
      <h2 id={titleId} className="mt-2 font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {truncatedDescription}
      </p>
      <div className="mt-4 flex justify-end">
        <Button
          label="Details"
          onClick={onClick}
          dataTestId={id ? `card-details-${id}` : "card-details-button"}
          ariaLabel={`View details for ${title}`}
        />
      </div>
    </article>
  );
};
