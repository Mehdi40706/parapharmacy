import type { User } from '~/types/user';
import type { PaginatedResponse } from '~/types/product';

export const useAdminUsers = () => {
  const api = useApi();

  const fetchUsers = (query?: { search?: string; page?: number; limit?: number }) =>
    api<PaginatedResponse<User>>('/users', { params: query });

  const updateUserRole = (id: string, role: 'CLIENT' | 'ADMIN') =>
    api(`/users/${id}/role`, { method: 'PATCH', body: { role } });

  const deleteUser = (id: string) => 
    api(`/users/${id}`, { method: 'DELETE' });

  return { fetchUsers, updateUserRole, deleteUser };
};