import { apiRequest } from './api';

export function getReviews(movieId, signal) {
  return apiRequest(`/api/movies/${movieId}/reviews`, { signal });
}

export function createReview(movieId, data) {
  return apiRequest(`/api/movies/${movieId}/reviews`, { method: 'POST', body: JSON.stringify(data) });
}

export function updateReview(id, data) {
  return apiRequest(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteReview(id) {
  return apiRequest(`/api/reviews/${id}`, { method: 'DELETE' });
}
