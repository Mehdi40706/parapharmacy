import { u as useApi } from './useApi-BHrVqC1i.mjs';

const usePayments = () => {
  const api = useApi();
  const initiatePayment = (orderId) => {
    return api(
      `/payments/checkout/${orderId}`,
      { method: "POST" }
    );
  };
  const getPaymentStatus = (orderId) => {
    return api(
      `/payments/status/${orderId}`
    );
  };
  return { initiatePayment, getPaymentStatus };
};

export { usePayments as u };
//# sourceMappingURL=usePayments-WV98gq0g.mjs.map
