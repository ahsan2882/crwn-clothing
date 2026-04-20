import { ProductCollection } from "./product.model";

export interface CategoryType {
  id: number;
  title: string;
  imageUrl: string;
  route: string;
}

export interface CategoryState {
  categories: ProductCollection[];
  isLoading: boolean;
  error?: Error | null;
}
