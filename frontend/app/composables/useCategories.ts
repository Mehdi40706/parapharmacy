import type { Category } from '~/types/product';

export const useCategories = () => {
  const api = useApi();

  const fetchCategories = () => {
    return api<Category[]>('/categories');
  };

  return { fetchCategories };
};
