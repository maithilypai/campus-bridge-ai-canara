/**
 * Campus Bridge AI — API Service Layer
 * =====================================
 * Centralised wrapper around all backend REST calls.
 * Base URL is read from VITE_API_URL (set in .env).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Token helpers (sessionStorage only — never persisted in localStorage) ──
const TOKEN_KEY = 'cb_token';

export const tokenStore = {
  get: ()      => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: ()    => sessionStorage.removeItem(TOKEN_KEY),
};

// ── Core request helper ────────────────────────────────────────────────────
/**
 * Thin fetch wrapper.
 * Returns { data, error, status } — never throws.
 * Supports both JSON payloads and multipart/form-data (for PDF uploads).
 *
 * @param {string} endpoint   - Path relative to BASE_URL, e.g. '/api/auth/login'
 * @param {object} [options]  - Fetch options (method, body, requiresAuth, …)
 * @returns {Promise<{ data: any|null, error: string|null, status: number }>}
 */
async function request(endpoint, options = {}) {
  const { method = 'GET', body, requiresAuth = false } = options;

  const headers = {};

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const token = tokenStore.get();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        json?.message ||
        (json?.errors?.join(', ')) ||
        `Request failed with status ${res.status}`;
      return { data: null, error: errorMsg, status: res.status };
    }

    return { data: json, error: null, status: res.status };
  } catch (networkErr) {
    return {
      data: null,
      error: 'Cannot reach the server. Please ensure the backend is active on port 5000.',
      status: 0,
    };
  }
}

// ── Auth API calls ─────────────────────────────────────────────────────────

export async function registerStudent(payload) {
  return request('/api/auth/register', { method: 'POST', body: payload });
}

export async function loginStudent(payload) {
  return request('/api/auth/login', { method: 'POST', body: payload });
}

export async function getMyProfile() {
  return request('/api/auth/me', { requiresAuth: true });
}

// ── Academic Resource API calls (Autonomous Curriculum) ────────────────────

/**
 * Fetch list of academic resources with optional query filters.
 * @param {object} [filters] - { year, semester, category, subjectCode, search }
 */
export async function fetchResources(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'all') {
      params.append(key, val);
    }
  });
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return request(`/api/resources${queryString}`);
}

/**
 * Fetch single resource metadata by ID.
 * @param {string} id
 */
export async function fetchResourceById(id) {
  return request(`/api/resources/${id}`);
}

/**
 * Upload a new academic resource PDF (Admin only).
 * @param {FormData} formData
 */
export async function uploadResource(formData) {
  return request('/api/resources', {
    method: 'POST',
    body: formData,
    requiresAuth: true,
  });
}

/**
 * Update an existing academic resource (Admin only).
 * @param {string} id
 * @param {FormData|object} payload
 */
export async function updateResource(id, payload) {
  return request(`/api/resources/${id}`, {
    method: 'PUT',
    body: payload,
    requiresAuth: true,
  });
}

/**
 * Delete an academic resource and unlinks file (Admin only).
 * @param {string} id
 */
export async function deleteResource(id) {
  return request(`/api/resources/${id}`, {
    method: 'DELETE',
    requiresAuth: true,
  });
}

/**
 * Return absolute streaming URL for inline PDF view.
 * @param {string} id
 */
export function getResourceViewUrl(id) {
  return `${BASE_URL}/api/resources/${id}/view`;
}

/**
 * Return absolute download URL for PDF attachment.
 * @param {string} id
 */
export function getResourceDownloadUrl(id) {
  return `${BASE_URL}/api/resources/${id}/download`;
}

// ── Default Export ─────────────────────────────────────────────────────────
const api = {
  registerStudent,
  loginStudent,
  getMyProfile,
  fetchResources,
  fetchResourceById,
  uploadResource,
  updateResource,
  deleteResource,
  getResourceViewUrl,
  getResourceDownloadUrl,
  tokenStore,
};

export default api;
