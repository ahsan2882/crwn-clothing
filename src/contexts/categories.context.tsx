import { createContext, ReactNode, useState, useEffect } from "react";
import { Product } from "../models/product.model";
import {
  // addCollectionAndDocuments,
  getCategoriesAndDocuments,
} from "../utils/firebase/firebase.utils";
// import SHOP_DATA from "../shop-data";

type CategoryContextType = {
  categoriesMap: Record<string, Product[]>;
};

export const CategoriesContext = createContext<CategoryContextType>({
  categoriesMap: {},
});

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  // do this only once to push to firestore
  // useEffect(() => {
  //   addCollectionAndDocuments("categories", SHOP_DATA);
  // }, []);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    const getCategoriesMap = async () => {
      try {
        const categoryMap = await getCategoriesAndDocuments("categories");
        setCategoriesMap(categoryMap);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoriesMap();
  }, []);

  const value = { categoriesMap };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
