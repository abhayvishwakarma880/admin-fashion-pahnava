import http from './http';

// Upload image to Cloudinary via Backend API
export const uploadImageApi = async (imageData) => {
  const response = await http.post('/upload', { image: imageData });
  return response.data;
};

// Get all products
export const getProducts = async (params = {}) => {
  const response = await http.get('/products', { params });
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await http.get(`/products/${id}`);
  return response.data;
};

// Create a new product
export const createProduct = async (productData) => {
  const response = await http.post('/products', productData);
  return response.data;
};

// Update an existing product
export const updateProduct = async (id, productData) => {
  const response = await http.put(`/products/${id}`, productData);
  return response.data;
};

// Toggle / Update product status (PATCH)
export const updateProductStatus = async (id, isActive) => {
  const response = await http.patch(`/products/${id}/status`, { isActive });
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await http.delete(`/products/${id}`);
  return response.data;
};
