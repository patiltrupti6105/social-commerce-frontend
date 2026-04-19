import api from './axiosConfig'

export const orderApi = {
  getAddresses: () => api.get('/addresses'),
  addAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  checkout: (addressId) => api.post('/orders/checkout', { addressId }),
  mockPay: (orderId) => api.post('/payments/mock-pay', { orderId }),
  getOrders: (page=0) => api.get(`/orders?page=${page}`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getSellerOrders: (page=0) => api.get(`/seller/orders?page=${page}`),
  shipOrder: (id) => api.put(`/seller/orders/${id}/ship`),
  deliverOrder: (id) => api.put(`/seller/orders/${id}/deliver`),
}
