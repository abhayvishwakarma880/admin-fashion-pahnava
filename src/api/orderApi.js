import http from './http';

// Get all orders with searching, status filter & pagination
export const getOrders = async (params = {}) => {
  const response = await http.get('/orders', { params });
  return response.data;
};

// Get single order details
export const getOrderById = async (id) => {
  const response = await http.get(`/orders/${id}`);
  return response.data;
};

// Update order status (PATCH)
export const updateOrderStatus = async (id, status) => {
  const response = await http.patch(`/orders/${id}/status`, { status });
  return response.data;
};

// Delete order
export const deleteOrder = async (id) => {
  const response = await http.delete(`/orders/${id}`);
  return response.data;
};
