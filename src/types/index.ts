export interface Variant {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  mrp: number;
  price: number;
  stock: number;
  description: string;
  variants?: Variant[];
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  variantId?: string;
}
