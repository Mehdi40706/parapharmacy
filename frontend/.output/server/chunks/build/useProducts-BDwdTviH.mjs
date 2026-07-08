import { u as useApi } from './useApi-BHrVqC1i.mjs';

const normalizeProduct = (p) => ({
  ...p,
  price: Number(p.price)
});
const useProducts = () => {
  const api = useApi();
  const fetchProducts = async (query) => {
    const result = await api("/products", { params: query });
    return {
      ...result,
      data: result.data.map(normalizeProduct)
    };
  };
  const fetchProductBySlug = async (slug) => {
    const product = await api(`/products/slug/${slug}`);
    return normalizeProduct(product);
  };
  return { fetchProducts, fetchProductBySlug };
};

export { useProducts as u };
//# sourceMappingURL=useProducts-BDwdTviH.mjs.map
