import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swadeshi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- AUTH ----
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// ---- DESTINATIONS ----
export const getAllDestinations = () => api.get('/destinations');
export const getDestinationById = (id) => api.get(`/destinations/${id}`);
export const searchDestinations = (name) => api.get(`/destinations/search?name=${name}`);
export const getFeaturedDestinations = () => api.get('/destinations/featured');
export const getActiveOffers = () => api.get('/offers/active');

// ---- PLACES ----
export const getPlacesByDestination = (destinationId) =>
  api.get(`/places/destination/${destinationId}`);

// ---- GUIDES ----
export const getAllGuides = () => api.get('/guides');
export const getGuidesByDestination = (destinationId) =>
  api.get(`/guides/destination/${destinationId}`);

// ---- BOOKINGS ----
export const createBooking = (data) => api.post('/bookings/create', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const processPayment = (data) => api.post('/bookings/payment', data);

// ---- PDF ----
export const downloadPdf = async (bookingId) => {
  const response = await api.get(`/pdf/download/${bookingId}`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `itinerary_${bookingId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// ---- USER PROFILE ----
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// ---- IMAGE UPLOAD ----
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ---- ADMIN ----
export const getAnalytics = () => api.get('/admin/analytics');
export const adminGetUsers = () => api.get('/admin/users');
export const adminToggleUser = (id) => api.put(`/admin/users/${id}/toggle-active`);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminGetBookings = (from, to) => {
  const params = from && to ? `?from=${from}&to=${to}` : '';
  return api.get(`/admin/bookings${params}`);
};
export const adminAddDestination = (data) => api.post('/admin/destinations', data);
export const adminUpdateDestination = (id, data) => api.put(`/admin/destinations/${id}`, data);
export const adminDeleteDestination = (id) => api.delete(`/admin/destinations/${id}`);
export const adminToggleFeatured = (id) => api.put(`/admin/destinations/${id}/toggle-featured`);
export const adminAddPlace = (data) => api.post('/admin/places', data);
export const adminUpdatePlace = (id, data) => api.put(`/admin/places/${id}`, data);
export const adminDeletePlace = (id) => api.delete(`/admin/places/${id}`);
export const adminAddGuide = (data) => api.post('/admin/guides', data);
export const adminUpdateGuide = (id, data) => api.put(`/admin/guides/${id}`, data);
export const adminDeleteGuide = (id) => api.delete(`/admin/guides/${id}`);
export const adminGetOffers = () => api.get('/admin/offers');
export const adminCreateOffer = (data) => api.post('/admin/offers', data);
export const adminUpdateOffer = (id, data) => api.put(`/admin/offers/${id}`, data);
export const adminDeleteOffer = (id) => api.delete(`/admin/offers/${id}`);

export default api;
