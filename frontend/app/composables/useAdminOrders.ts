import type { Order, PaginatedResponse } from '~/types/order';

const normalizeOrder = (o: any): Order => ({
  ...o,
  totalPrice: Number(o.totalPrice),
  items: o.items.map((item: any) => ({
    ...item,
    price: Number(item.price),
    product: { ...item.product, price: Number(item.product.price) },
  })),
});

export const useAdminOrders = () => {
  const api = useApi();

  const fetchAllOrders = async (query?: { status?: string; page?: number; limit?: number }) => {
    const result = await api<PaginatedResponse<Order & { user: any }>>('/orders', { params: query });
    return { ...result, data: result.data.map(normalizeOrder) };
  };

  const updateOrderStatus = (id: string, status: string) =>
    api(`/orders/${id}/status`, { method: 'PATCH', body: { status } });

  return { fetchAllOrders, updateOrderStatus };
};