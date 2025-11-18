import axios from 'axios';

// In development, vite-rails serves from /vite-dev/, so we need to use absolute URLs
// In production, Rails serves everything from the same origin, so relative URLs work
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3000' 
  : '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;

