// Single place to configure API calls. Only VITE_API_URL is exposed to the browser;
// MongoDB credentials and JWT_SECRET must remain on the backend.
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, { method = 'GET', body, ...options } = {}) {
  const token = localStorage.getItem('campusconnect_token');
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...options,
    });
  } catch {
    throw new Error('Cannot connect to the server. Check that the backend is running.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body }),
  patch: (url, body) => request(url, { method: 'PATCH', body }),
};
