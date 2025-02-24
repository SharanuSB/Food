export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface Dish {
    id: string;
    name: string;
    ingredients: string[];
    diet: 'vegetarian' | 'non vegetarian';
    prep_time: number;
    cook_time: number;
    flavor_profile: string;
    course: string;
    state: string;
    region: string;
}

export interface DishFilters {
    diet?: 'vegetarian' | 'non vegetarian';
    flavor_profile?: string;
    course?: string;
    state?: string;
    region?: string;
    maxPrepTime?: number;
    maxCookTime?: number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}