import { apiRequest } from './api';

export function getMovies(signal) {
  return apiRequest('/api/movies', { signal });
}

export function getMovie(id) {
  return apiRequest(`/api/movies/${id}`);
}
