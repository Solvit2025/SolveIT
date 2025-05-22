const API_BASE_URL = 'http://localhost:8000';

// --- Utility Functions ---
const getToken = () => localStorage.getItem('access_token');

const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    throw new Error("Invalid date format. Use Date or 'YYYY-MM-DD' string.");
};

const buildQueryParams = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        const formatted = formatDate(value);
        if (formatted) searchParams.set(key, formatted);
    });
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.detail || `${response.status} - ${response.statusText}`;
        throw new Error(`API Error: ${message}`);
    }
    return await response.json();
};

const request = async (endpoint, method = 'GET', options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        ...options,
    });

    return handleResponse(response);
};

// --- Auth Endpoints ---
export const companyRegister = (data) => request('/api/auth/register/company', 'POST', {
    body: JSON.stringify(data),
});

export const userRegister = (data) => request('/api/auth/register/user', 'POST', {
    body: JSON.stringify(data),
});

export const login = (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return request('/api/auth/login', 'POST', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
};

export const getProfile = () => request('/api/protected/me');

// --- Company Dashboard ---
export const registerServiceDocument = async ({ serviceCategory, contactEmail, contactPhone, file }) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('service_category', serviceCategory);
    formData.append('contact_email', contactEmail);
    formData.append('contact_phone', contactPhone);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/company-dashboard/register-service`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return handleResponse(response);
};

export const getCompanyServices = () => request('/api/company-dashboard/my-services');

export const getCompanyInteractionLogs = (startDate = null, endDate = null) =>
    request(`/api/company-dashboard/logs${buildQueryParams({ start_date: startDate, end_date: endDate })}`);

export const getPendingCompanyInteractionLogs = (startDate = null, endDate = null) =>
    request(`/api/company-dashboard/pending-logs${buildQueryParams({ start_date: startDate, end_date: endDate })}`);
export const updateCompanyInteractionResponse = (interactionId, responseContent) =>
    request(`/api/company-dashboard/update-response/${interactionId}`, 'PATCH', {
      body: JSON.stringify({ response_content: responseContent }),
    });
  
// --- User Dashboard ---
export const submitUserRequest = async ({ companyName, serviceCategory, requestText, audioFile }) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('service_category', serviceCategory);
    if (requestText) formData.append('request_text', requestText);
    if (audioFile) formData.append('audio', audioFile);

    const response = await fetch(`${API_BASE_URL}/api/user-dashboard/user-request`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return handleResponse(response);
};

export const getServiceItemsByCompany = () => request('/api/user-dashboard/get-all-services');

export const getUserInteractionLogs = (startDate = null, endDate = null) =>
    request(`/api/user-dashboard/logs${buildQueryParams({ start_date: startDate, end_date: endDate })}`);
export const getPendingUserInteractionLogs = (startDate = null, endDate = null) =>
    request(`/api/user-dashboard/pending-logs${buildQueryParams({ start_date: startDate, end_date: endDate })}`);
