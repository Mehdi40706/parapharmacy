import { u as useApi } from './useApi-BHrVqC1i.mjs';

const useCategories = () => {
  const api = useApi();
  const fetchCategories = () => {
    return api("/categories");
  };
  return { fetchCategories };
};

export { useCategories as u };
//# sourceMappingURL=useCategories-Bz1hFXAX.mjs.map
