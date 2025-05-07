// Base URL for the API
const API_BASE_URL = "http://localhost:3002/api/v1";

// Accounts API Endpoints
const ACCOUNTS_GET_ALL = `${API_BASE_URL}/accounts`;
const ACCOUNTS_GET_BY_ID = `${API_BASE_URL}/accounts/{id}`;
const ACCOUNTS_CREATE = `${API_BASE_URL}/accounts`;
const ACCOUNTS_UPDATE = `${API_BASE_URL}/accounts/{username}`;
const ACCOUNTS_DELETE = `${API_BASE_URL}/accounts/{username}`;

// Categories API Endpoints
const CATEGORIES_GET_ALL = `${API_BASE_URL}/categories`;
const CATEGORIES_GET_BY_ID = `${API_BASE_URL}/categories/{id}`;
const CATEGORIES_CREATE = `${API_BASE_URL}/categories`;
const CATEGORIES_UPDATE = `${API_BASE_URL}/categories/{id}`;
const CATEGORIES_DELETE = `${API_BASE_URL}/categories/{id}`;

// Events API Endpoints
const EVENTS_GET_ALL = `${API_BASE_URL}/events`;
const EVENTS_GET_BY_ID = `${API_BASE_URL}/events/{id}`;
const EVENTS_CREATE = `${API_BASE_URL}/events`;
const EVENTS_UPDATE = `${API_BASE_URL}/events/{id}`;
const EVENTS_DELETE = `${API_BASE_URL}/events/{id}`;
const EVENTS_UPLOAD_IMAGE = `${API_BASE_URL}/events/{id}/upload-image`;
const EVENTS_GET_BY_USER = `${API_BASE_URL}/users/{username}/events`;
const EVENTS_GET_BY_CATEGORY = `${API_BASE_URL}/categories/{categoryId}/events`;

// Participants API Endpoints
const PARTICIPANTS_GET_ALL = `${API_BASE_URL}/participants`;
const PARTICIPANTS_GET_BY_ID = `${API_BASE_URL}/participants/{id}`;
const PARTICIPANTS_CREATE = `${API_BASE_URL}/participants`;
const PARTICIPANTS_UPDATE = `${API_BASE_URL}/participants/{id}`;
const PARTICIPANTS_DELETE = `${API_BASE_URL}/participants/{id}`;
const PARTICIPANTS_GET_BY_EVENT = `${API_BASE_URL}/events/{eventId}/participants`;