export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'CLIENT' | 'ADMIN';
  createdAt: string;
}