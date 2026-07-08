import { u as useApi } from './useApi-BHrVqC1i.mjs';

const useAdminProducts = () => {
  const api = useApi();
  const createProduct = (payload) => api("/products", { method: "POST", body: payload });
  const updateProduct = (id, payload) => api(`/products/${id}`, { method: "PATCH", body: payload });
  const deleteProduct = (id) => api(`/products/${id}`, { method: "DELETE" });
  return { createProduct, updateProduct, deleteProduct };
};

export { useAdminProducts as u };
//# sourceMappingURL=useAdminProducts-D3GZdgBR.mjs.map
