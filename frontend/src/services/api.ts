import axios from 'axios';
import {
    LoginCredentials,
    RegisterCredentials,
    Dish,
    DishFilters,
    PaginationOptions,
    PaginatedResponse
} from '../types';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials) => {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    },
};

// Dishes API
export const dishesAPI = {
    getAll: async (options: PaginationOptions): Promise<PaginatedResponse<Dish>> => {
        const { page, limit, sortBy, sortOrder } = options;

        try {
            const response = await api.get('/dishes', {
                params: { page, limit, sortBy, sortOrder },
            });

            // Ensure we're returning the correct structure even if the API response is different
            if (response.data.pagination && response.data.data) {
                return response.data;
            } else if (Array.isArray(response.data)) {
                // Handle case where API returns an array instead of paginated response
                const dishes = response.data;
                return {
                    data: dishes.slice((page - 1) * limit, page * limit),
                    pagination: {
                        total: dishes.length,
                        page,
                        limit,
                        totalPages: Math.ceil(dishes.length / limit)
                    }
                };
            } else {
                // Default fallback
                return {
                    data: response.data.results || response.data,
                    pagination: {
                        total: response.data.total || 255, // Set to total number of dishes in CSV
                        page,
                        limit,
                        totalPages: Math.ceil((response.data.total || 255) / limit)
                    }
                };
            }
        } catch (error) {
            console.error("Error fetching dishes:", error);
            // Return empty result set on error
            return {
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0
                }
            };
        }
    },

    getById: async (id: string): Promise<Dish> => {
        const response = await api.get(`/dishes/${id}`);
        return response.data;
    },

    searchByName: async (query: string): Promise<Dish[]> => {
        const response = await api.get('/dishes/search/name', {
            params: { q: query },
        });
        return response.data.results || [];
    },

    findByIngredients: async (ingredients: string[]): Promise<Dish[]> => {
        const response = await api.post('/dishes/by-ingredients', { ingredients });
        return response.data.results || [];
    },

    filter: async (filters: DishFilters): Promise<Dish[]> => {
        const response = await api.get('/dishes/filter', {
            params: filters,
        });
        return response.data.results || [];
    },
};

export default api;