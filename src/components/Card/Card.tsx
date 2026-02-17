import Image from "next/image";

type CardProps = {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  onClick,
}) => {
  return (
    <div
      className="card"
      onClick={onClick}
      data-testid="card"
      aria-label={`card-${title}`}
    >
      <Image src={image} alt={title} width={100} height={100} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
