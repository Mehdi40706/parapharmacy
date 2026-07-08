import type { Product } from '~/types/product';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

export const useAdminProducts = () => {
  const api = useApi();

  const createProduct = (payload: ProductPayload) =>
    api<Product>('/products', { method: 'POST', body: payload });

  const updateProduct = (id: string, payload: Partial<ProductPayload>) =>
    api<Product>(`/products/${id}`, { method: 'PATCH', body: payload });

  const deleteProduct = (id: string) =>
    api(`/products/${id}`, { method: 'DELETE' });

  return { createProduct, updateProduct, deleteProduct };
};