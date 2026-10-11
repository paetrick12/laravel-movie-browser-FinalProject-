import { apiRequest } from './api';

export async function login(data) {
  await apiRequest('/sanctum/csrf-cookie');
  return apiRequest('/api/login', { method: 'POST', body: JSON.stringify(data) });
}

export async function register(data) {
  await apiRequest('/sanctum/csrf-cookie');
  return apiRequest('/api/register', { method: 'POST', body: JSON.stringify(data) });
}

export function logout() {
  return apiRequest('/api/logout', { method: 'POST' });
}

export function getUser() {
  return apiRequest('/api/user');
}
