import React from "react";
import CategoryItem from "../category-item/category-item.component";
import { Category } from "../../models/category.model";
import "./directory.styles.scss";

interface DirectoryProps {
  categories: Category[];
}

export default function Directory({ categories }: DirectoryProps) {
  return (
    <div className="directory-container">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}
