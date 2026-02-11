import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth endpoints
export const authAPI = {
  login: (username, password, mode = 'dummy') => 
    api.post('/auth/login', { username, password, mode }),
  getMode: () => api.get('/auth/mode'),
  setMode: (mode) => api.post('/auth/mode', { mode })
};

// Patient endpoints
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  search: (query) => api.get(`/patients/search/${query}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data)
};

// Vitals endpoints
export const vitalsAPI = {
  getByPatient: (patientId) => api.get(`/vitals/patient/${patientId}`),
  getLatest: (patientId) => api.get(`/vitals/latest/${patientId}`),
  getSummary: (patientId) => api.get(`/vitals/summary/${patientId}`),
  record: (data) => api.post('/vitals', data)
};

// Consultation endpoints
export const consultationAPI = {
  getByPatient: (patientId) => api.get(`/consultations/patient/${patientId}`),
  getById: (id) => api.get(`/consultations/${id}`),
  create: (data) => api.post('/consultations', data)
};

// Disease endpoints
export const diseaseAPI = {
  getAll: () => api.get('/diseases'),
  getById: (id) => api.get(`/diseases/${id}`),
  search: (query) => api.get(`/diseases/search/${query}`)
};

// Settings endpoints
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  get: (key) => api.get(`/settings/${key}`),
  set: (key, value) => api.post(`/settings/${key}`, { value })
};

export default api;
