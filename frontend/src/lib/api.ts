import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

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
        throw {
            message: error.response?.data?.detail || 'Something went wrong',
            status: error.response?.status,
        };
    }
};

// Tool-specific helpers
export const generateLesson = (data: any) => generateContent('/lesson/generate', data);
export const generateQuiz = (data: any) => generateContent('/quiz/generate', data);
export const generateStory = (data: any) => generateContent('/story/generate', data);

// Content Management
export const getContents = async (skip = 0, limit = 100) => {
    try {
        const response = await api.get(`/content/?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw { message: error.response?.data?.detail || 'Failed to fetch content' };
    }
};

export const saveContent = async (content: any) => {
    try {
        const response = await api.post('/content/', content);
        return response.data;
    } catch (error: any) {
        throw { message: error.response?.data?.detail || 'Failed to save content' };
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
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: any) {
        throw {
            message: error.response?.data?.detail || 'Login failed',
            status: error.response?.status,
        };
    }
};

export const signup = async (data: any) => {
    try {
        const response = await api.post('/auth/signup', data);
        return response.data;
    } catch (error: any) {
        throw {
            message: error.response?.data?.detail || 'Signup failed',
            status: error.response?.status,
        };
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/user/me');
        return response.data;
    } catch (error: any) {
        throw {
            message: error.response?.data?.detail || 'Failed to fetch user',
            status: error.response?.status,
        };
    }
}

export default api;
