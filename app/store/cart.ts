import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types/cart';
import { ProductSize } from '../types/product';

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, size: ProductSize) => void;
  removeItem: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (productId: string, size: ProductSize) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === productId && item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { productId, size, quantity: 1 }],
          };
        }),

      removeItem: (productId: string, size: ProductSize) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        })),

      updateQuantity: (productId: string, size: ProductSize, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);