import { Product } from "@/app/shared/types";

type ProductsGridProps = {
  products: Product[];
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  return <div>Products Grid</div>;
};
