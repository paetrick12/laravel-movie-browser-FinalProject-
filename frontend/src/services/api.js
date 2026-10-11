const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function apiRequest(endpoint, options = {}) {
  const method = options.method || 'GET';
  const csrfCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(method !== 'GET' && csrfCookie
        ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfCookie.slice('XSRF-TOKEN='.length)) }
        : {}),
      ...options.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(data?.message || 'The request failed.');
    error.status = response.status;
    error.errors = data?.errors || {};
    throw error;
  }
  return data;
}

export function errorMessage(error) {
  const messages = Object.values(error.errors || {}).flat();
  return messages.length ? messages.join(' ') : error.message || 'Please try again.';
}
