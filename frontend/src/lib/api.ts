import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

export interface APIError {
    message: string;
    status?: number;
}

// Generic generation function
export const generateContent = async (endpoint: string, data: any) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error: any) {
        console.error('API Error:', error);
        const message = error.response?.data?.detail || error.message || 'Something went wrong';
        throw new Error(message);
    }
};

// Tool-specific helpers
export const generateLesson = (data: any) => generateContent('/lesson/generate', data);
export const generateQuiz = (data: any) => generateContent('/quiz/generate', data);
export const generateStory = (data: any) => generateContent('/story/generate', data);
export const generateToolContent = (tool_id: string, data: any) => generateContent(`/tools/${tool_id.replace(/-/g, '_')}/generate`, data);
export const generateVisuals = (data: any) => generateContent('/visual/generate', data);

// Content Management
export const getContents = async (skip = 0, limit = 100) => {
    try {
        const response = await api.get(`/content/?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || 'Failed to fetch content';
        throw new Error(message);
    }
};

export const saveContent = async (content: any) => {
    try {
        const response = await api.post('/content/', content);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || 'Failed to save content';
        throw new Error(message);
    }
};

// Library
export const getBooks = async (skip = 0, limit = 100) => {
    try {
        const response = await api.get(`/library/books?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        console.warn("Library fetch failed, using fallback");
        return [];
    }
};

// Auth helpers
export const login = async (formData: FormData) => {
    try {
        // Convert FormData to URLSearchParams for OAuth2 compatibility
        const params = new URLSearchParams();
        formData.forEach((value, key) => {
            params.append(key, value.toString());
        });

        const response = await api.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || 'Login failed';
        const err = new Error(message) as any;
        err.status = error.response?.status;
        throw err;
    }
};

export const signup = async (data: any) => {
    try {
        const response = await api.post('/auth/signup', data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || 'Signup failed';
        const err = new Error(message) as any;
        err.status = error.response?.status;
        throw err;
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/user/me');
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || error.message || 'Failed to fetch user';
        const err = new Error(message) as any;
        err.status = error.response?.status;
        throw err;
    }
}

export default api;
