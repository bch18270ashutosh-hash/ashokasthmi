export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  mrp: number;
  price: number;
  stock: number;
  description: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
