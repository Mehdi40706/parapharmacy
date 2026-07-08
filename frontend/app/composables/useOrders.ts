import type { Order, PaginatedResponse } from '~/types/order';

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
}

const normalizeOrder = (o: any): Order => ({
  ...o,
  totalPrice: Number(o.totalPrice),
  items: o.items.map((item: any) => ({
    ...item,
    price: Number(item.price),
    product: { ...item.product, price: Number(item.product.price) },
  })),
});

export const useOrders = () => {
  const api = useApi();

  const createOrder = async (payload: CreateOrderPayload) => {
    const order = await api<Order>('/orders', { method: 'POST', body: payload });
    return normalizeOrder(order);
  };

  const fetchMyOrders = async (query?: { status?: string; page?: number; limit?: number }) => {
    const result = await api<PaginatedResponse<Order>>('/orders/my', { params: query });
    return { ...result, data: result.data.map(normalizeOrder) };
  };

  const fetchOrderById = async (id: string) => {
    const order = await api<Order>(`/orders/${id}`);
    return normalizeOrder(order);
  };

  const cancelOrder = (id: string) => {
    return api(`/orders/${id}/cancel`, { method: 'PATCH' });
  };

  return { createOrder, fetchMyOrders, fetchOrderById, cancelOrder };
};