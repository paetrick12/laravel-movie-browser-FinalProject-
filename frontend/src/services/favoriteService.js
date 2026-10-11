import { apiRequest } from './api';

export function getFavorites(signal) {
  return apiRequest('/api/favorites', { signal });
}

export function addFavorite(movieId) {
  return apiRequest('/api/favorites', { method: 'POST', body: JSON.stringify({ movie_id: movieId }) });
}

export function removeFavorite(id) {
  return apiRequest(`/api/favorites/${id}`, { method: 'DELETE' });
}
