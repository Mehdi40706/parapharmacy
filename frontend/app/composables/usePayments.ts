export const usePayments = () => {
  const api = useApi();

  const initiatePayment = (orderId: string) => {
    return api<{ payUrl: string; paymentRef: string }>(
      `/payments/checkout/${orderId}`,
      { method: 'POST' },
    );
  };

  const getPaymentStatus = (orderId: string) => {
    return api<{ orderId: string; paymentStatus: string; orderStatus: string }>(
      `/payments/status/${orderId}`,
    );
  };

  return { initiatePayment, getPaymentStatus };
};