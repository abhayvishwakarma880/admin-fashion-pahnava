import http from '../http';

/**
 * Admin Login API call
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Axios Response
 */
export const adminLoginApi = async (credentials) => {
  const response = await http.post('/admin/login', credentials);
  return response.data;
};

/**
 * Get Admin Profile API call (Protected)
 * @returns {Promise} Axios Response
 */
export const getAdminProfileApi = async () => {
  const response = await http.get('/admin/profile');
  return response.data;
};
