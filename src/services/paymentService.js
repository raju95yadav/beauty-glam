import api from './api';

const paymentService = {
  createRazorpayOrder: async (orderData) => {
    const response = await api.post('/payment/create-order', orderData);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
  },

  downloadInvoice: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });

    // Create a Blob from the PDF Stream
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  }
};

export default paymentService;
