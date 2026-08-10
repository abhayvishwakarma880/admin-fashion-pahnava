import http from './http';

export const getContacts = async (params = {}) => {
  const response = await http.get('/contacts', { params });
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await http.delete(`/contacts/${id}`);
  return response.data;
};
