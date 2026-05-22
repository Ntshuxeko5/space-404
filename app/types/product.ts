export type ProductCategory = 'Space Suits' | 'Cosmic Casual' | 'Galactic Accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  sizes: ProductSize[];
  inStock: boolean;
  features?: string[];
}