import type { Product, PaginatedResponse } from '~/types/product';

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Normalise les champs Decimal (renvoyés en string par Prisma) en number
const normalizeProduct = (p: any): Product => ({
  ...p,
  price: Number(p.price),
});

export const useProducts = () => {
  const api = useApi();

  const fetchProducts = async (query?: ProductQuery) => {
    const result = await api<PaginatedResponse<Product>>('/products', { params: query });
    return {
      ...result,
      data: result.data.map(normalizeProduct),
    };
  };

  const fetchProductBySlug = async (slug: string) => {
    const product = await api<Product>(`/products/slug/${slug}`);
    return normalizeProduct(product);
  };

  return { fetchProducts, fetchProductBySlug };
};