import { AsyncSliceState } from "./async-state.model";
import { Product, ProductCollection } from "./product.model";

export interface CategoryType {
  id: number;
  title: string;
  imageUrl: string;
  route: string;
}

export interface CategoryState extends AsyncSliceState {
  categories: ProductCollection[];
}

export type CategoriesMap = Record<string, Product[]>;
