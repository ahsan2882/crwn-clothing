export interface ProductCollection {
  title: string;
  items: Product[];
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

export interface CartItemType extends Product {
  quantity: number;
}
