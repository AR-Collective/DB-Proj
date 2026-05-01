import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Uses the proxy configured in vite.config.js

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerDonor: (data) => api.post('/auth/register/donor', data),
  registerPatient: (data) => api.post('/auth/register/patient', data),
  registerStaff: (data) => api.post('/auth/register/staff', data),
  post: (endpoint, data) => api.post(endpoint, data),
};

export const bloodRequestAPI = {
  createRequest: (data) => api.post('/bloodrequest/create', data),
  getRequests: () => api.get('/bloodrequest/get'),
  updateRequest: (id, data) => api.put(`/bloodrequest/update/${id}`, data),
  deleteRequest: (id) => api.delete(`/bloodrequest/delete/${id}`),
};

export const donorAPI = {
  getCompatibleBlood: (patientId) => api.get(`/donor/compatible/${patientId}`),
  getDiseaseWisePatients: (disease) => api.get(`/donor/disease/${disease}`),
};

export const inventoryAPI = {
  getBloodTypeAvailability: () => api.get('/inventory/availability'),
};

export const testingAPI = {
  getTestResults: (donationId) => api.get(`/testing/results/${donationId}`),
  getNeverTestedDonors: () => api.get('/testing/never-tested'),
};

export default api;