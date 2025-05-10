import { sendRequest } from './api';

const checkoutService = {
  async createCheckoutSession() {
    const response = await sendRequest('/api/Checkout', { method: 'POST' });
    return response;
  }
};

export default checkoutService; 