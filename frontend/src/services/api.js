import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Uses the proxy configured in vite.config.js

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // sends cookies automatically
});

// Add token to requests if available
//api.interceptors.request.use((config) => {
//  const token = localStorage.getItem('token');
//  if (token) {
//    config.headers.Authorization = `Bearer ${token}`;
//  }
//  return config;
//});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerDonor: (data) => api.post('/auth/register/donor', data),
  registerPatient: (data) => api.post('/auth/register/patient', data),
  registerStaff: (data) => api.post('/auth/register/staff', data),
  post: (endpoint, data) => api.post(endpoint, data),
};

export const bloodRequestAPI = {
  createRequest: (data) => api.post('/bloodrequest/insertBReq', data),
  getRequestsByHospital: (hospitalid) => api.get('/bloodrequest/getReqByHospital', {params: {hospitalid}}),
  getBloodUnits: (breqid) => api.get('/bloodrequest/getBU', { params: { breqid } }),
  fulfillRequest: (requestid, unitid) =>  api.patch('/bloodrequest/fulfillRequest', { requestid, unitid })
};


export const donorAPI = {
  searchDonors: (bloodtype) => api.post('/donor/search', { bloodtype }),
  getDonationHistory: (donorid) => api.post('/donor/history', { donorid }),
  rateDonor: (donorid, rating) => api.post('/donor/rate', { donorid, rating }),
  getAverageDonations: () => api.get('/donor/statistics/average'),
  getNeverTested: () => api.get('/donor/never-tested'),
};

export const patientAPI = {
  getCompatibleBlood: (patientid) => api.post('/patient/compatible-blood', { patientid }),
  searchByDisease: (disease) => api.post('/patient/search-disease', { disease }),
};

export const inventoryAPI = {
  getByLocation: () => api.get('/inventory/by-location'),
  getExpiringUnits: (days) => api.get('/inventory/expiring', { params: { days } }),
  removeExpiredUnits: () => api.delete('/inventory/remove-expired'),
  getBloodDemand: () => api.get('/inventory/demand'),
  getAvailabilityReport: () => api.get('/inventory/availability-report'),
};

export const hospitalAPI = {
  getHospitalStock: () => api.get('/hospital/stock-comparison'),
};

export const testingAPI = {
  getTestResults: () => api.get('/testing/results'),
};

export default api;
