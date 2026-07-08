import { defineStore } from 'pinia';
import type { Product } from '~/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    total: (state) =>
      state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(product: Product, quantity = 1) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
      this.persist();
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
          this.persist();
        }
      }
    },

    removeItem(productId: string) {
      this.items = this.items.filter((i) => i.product.id !== productId);
      this.persist();
    },

    clear() {
      this.items = [];
      this.persist();
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },

    restore() {
      if (import.meta.client) {
        const stored = localStorage.getItem('cart');
        if (stored) {
          try {
            this.items = JSON.parse(stored);
          } catch {
            this.items = [];
          }
        }
      }
    },
  },
});