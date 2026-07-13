import type { Product, PaginatedResponse } from '~/types/product';

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
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

  const fetchAllProducts = async (query?: ProductQuery) => {
     const result = await api<PaginatedResponse<Product>>('/products/admin/all', { params: query }); 
        return {
        ...result,
         data: result.data.map(normalizeProduct),
       };
   };

  const fetchActiveProducts = async (query?: ProductQuery) => {
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

  return { fetchActiveProducts, fetchProductBySlug, fetchAllProducts };
};