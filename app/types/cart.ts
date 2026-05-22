import { ProductSize } from './product';

export interface CartItem {
  productId: string;
  quantity: number;
  size: ProductSize;
}

export interface Cart {
  items: CartItem[];
}