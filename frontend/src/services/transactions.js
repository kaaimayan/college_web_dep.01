import api from './api';

export const issueBook = async (issueData) => {
  const response = await api.post('/transactions/issue', issueData);
  return response.data;
};

export const returnBook = async (returnPayload) => {
  const response = await api.post('/transactions/return', returnPayload);
  return response.data;
};

export const getTransactions = async (filters = {}) => {
  const response = await api.get('/transactions', { params: filters });
  return response.data;
};

export const getOverdueBooks = async () => {
  const response = await api.get('/transactions/overdue');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/transactions/dashboard-stats');
  return response.data;
};

// Reservations
export const getReservations = async () => {
  const response = await api.get('/transactions/reservations');
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post('/transactions/reservations', reservationData);
  return response.data;
};

export const updateReservationStatus = async (id, status) => {
  const response = await api.put(`/transactions/reservations/${id}`, { status });
  return response.data;
};

// Fines
export const getFines = async (filters = {}) => {
  const response = await api.get('/transactions/fines', { params: filters });
  return response.data;
};

export const payFine = async (id) => {
  const response = await api.put(`/transactions/fines/${id}/pay`);
  return response.data;
};

// Reports
export const getBooksReport = async () => {
  const response = await api.get('/reports/books');
  return response.data;
};

export const getStudentsReport = async () => {
  const response = await api.get('/reports/students');
  return response.data;
};

export const getTransactionsReport = async (filters = {}) => {
  const response = await api.get('/reports/transactions', { params: filters });
  return response.data;
};

export const getFinesReport = async (filters = {}) => {
  const response = await api.get('/reports/fines', { params: filters });
  return response.data;
};
