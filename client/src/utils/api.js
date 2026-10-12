const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4001/api/v1';

export async function apiFetch(path, options = {}) {
  const { headers: requestHeaders, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...requestHeaders }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || payload.message || 'Request failed');
    error.fieldErrors = payload.error?.fields || {};
    throw error;
  }
  return payload;
}

export { API_BASE_URL };
