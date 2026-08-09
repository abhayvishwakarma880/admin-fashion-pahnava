import http from './http';

// Upload image to Cloudinary via Backend API (shared upload endpoint)
export const uploadCategoryImageApi = async (imageData) => {
  const response = await http.post('/upload', { image: imageData });
  return response.data;
};

// Fetch all categories
export const getCategories = async (params = {}) => {
  const response = await http.get('/categories', { params });
  return response.data;
};

// Fetch single category
export const getCategoryById = async (id) => {
  const response = await http.get(`/categories/${id}`);
  return response.data;
};

// Create a new category
export const createCategory = async (categoryData) => {
  const response = await http.post('/categories', categoryData);
  return response.data;
};

// Update an existing category
export const updateCategory = async (id, categoryData) => {
  const response = await http.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Toggle / Update category active status (PATCH)
export const updateCategoryStatus = async (id, isActive) => {
  const response = await http.patch(`/categories/${id}/status`, { isActive });
  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await http.delete(`/categories/${id}`);
  return response.data;
};
