import type { Category } from '~/types/product';

export const useAdminCategories = () => {
  const api = useApi();

  const createCategory = (name: string) =>
    api<Category>('/categories', { method: 'POST', body: { name } });

  const updateCategory = (id: string, name: string) =>
    api<Category>(`/categories/${id}`, { method: 'PATCH', body: { name } });

  const deleteCategory = (id: string) =>
    api(`/categories/${id}`, { method: 'DELETE' });

  return { createCategory, updateCategory, deleteCategory };
};