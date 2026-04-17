import { createContext, ReactNode, useState } from "react";
import { Product } from "../models/product.model";
import PRODUCTS from "../shop-data.json";

type ProductsContextType = {
  products: Product[];
};

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
});

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const value = { products };
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
