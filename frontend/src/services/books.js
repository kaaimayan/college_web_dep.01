import api from './api';

export const getBooks = async (filters = {}) => {
  const response = await api.get('/books', { params: filters });
  return response.data;
};

export const getBook = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (formData) => {
  const response = await api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateBook = async (id, formData) => {
  const response = await api.put(`/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/books/categories');
  return response.data;
};

export const getAuthors = async () => {
  const response = await api.get('/books/authors');
  return response.data;
};

export const getPublishers = async () => {
  const response = await api.get('/books/publishers');
  return response.data;
};
