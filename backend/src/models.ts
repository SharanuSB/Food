import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// File paths
const DISHES_FILE = path.join(__dirname, 'data', 'dishes.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// ===== Type Definitions =====

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

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
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

// Define the filter interface explicitly
export interface DishFilters {
    diet?: 'vegetarian' | 'non vegetarian';
    flavor_profile?: string;
    course?: string;
    state?: string;
    region?: string;
    maxPrepTime?: number;
    maxCookTime?: number;
}

// ===== Helper Functions =====

// Ensure data files exist
const ensureFileExists = (filePath: string): void => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

// ===== Dish Model =====

export const DishModel = {
    getAll: (
        options: PaginationOptions = { page: 1, limit: 10 }
    ): PaginatedResponse<Dish> => {
        ensureFileExists(DISHES_FILE);
        let dishes: Dish[] = [];

        try {
            const data = fs.readFileSync(DISHES_FILE, 'utf-8');
            dishes = JSON.parse(data);

            console.log(`Total dishes loaded from JSON: ${dishes.length}`);
        } catch (error) {
            console.error('Error reading dishes file:', error);
            dishes = [];
        }

        if (options.sortBy) {
            const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
            dishes.sort((a, b) => {
                const aValue = a[options.sortBy as keyof Dish];
                const bValue = b[options.sortBy as keyof Dish];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder * aValue.localeCompare(bValue);
                }

                if (aValue < bValue) return -1 * sortOrder;
                if (aValue > bValue) return 1 * sortOrder;
                return 0;
            });
        }

        // Get total count
        const total = dishes.length;
        let paginatedDishes;
        if (options.limit >= 1000) {
            paginatedDishes = dishes;
        } else {
            const startIndex = Math.min((options.page - 1) * options.limit, total);
            const endIndex = Math.min(startIndex + options.limit, total);
            paginatedDishes = dishes.slice(startIndex, endIndex);
        }

        const totalPages = Math.ceil(total / options.limit);

        return {
            data: paginatedDishes,
            pagination: {
                total,
                page: options.page,
                limit: options.limit,
                totalPages
            }
        };
    },

    getById: (id: string): Dish | null => {
        ensureFileExists(DISHES_FILE);

        try {
            const data = fs.readFileSync(DISHES_FILE, 'utf-8');
            const dishes: Dish[] = JSON.parse(data);
            const dish = dishes.find(d => d.id === id);
            return dish || null;
        } catch (error) {
            console.error('Error finding dish by ID:', error);
            return null;
        }
    },

    // Search dishes by name
    searchByName: (query: string): Dish[] => {
        ensureFileExists(DISHES_FILE);

        try {
            const data = fs.readFileSync(DISHES_FILE, 'utf-8');
            const dishes: Dish[] = JSON.parse(data);

            const searchRegex = new RegExp(query, 'i');

            return dishes.filter(dish =>
                searchRegex.test(dish.name) ||
                searchRegex.test(dish.region) ||
                searchRegex.test(dish.state) ||
                searchRegex.test(dish.flavor_profile)
            );
        } catch (error) {
            console.error('Error searching dishes:', error);
            return [];
        }
    },

    // Find dishes by ingredients
    findByIngredients: (ingredients: string[]): Dish[] => {
        ensureFileExists(DISHES_FILE);

        try {
            const data = fs.readFileSync(DISHES_FILE, 'utf-8');
            const dishes: Dish[] = JSON.parse(data);

            return dishes.filter(dish => {
                const dishIngredients = dish.ingredients.map(i => i.toLowerCase());
                return ingredients.every(ingredient =>
                    dishIngredients.some(di => di.includes(ingredient.toLowerCase()))
                );
            });
        } catch (error) {
            console.error('Error finding dishes by ingredients:', error);
            return [];
        }
    },

    // Filter dishes by various criteria
    filter: (filters: DishFilters): Dish[] => {
        ensureFileExists(DISHES_FILE);

        try {
            const data = fs.readFileSync(DISHES_FILE, 'utf-8');
            let dishes: Dish[] = JSON.parse(data);

            if (filters.diet) {
                dishes = dishes.filter(dish => dish.diet === filters.diet);
            }

            if (filters.flavor_profile) {
                dishes = dishes.filter(dish => dish.flavor_profile === filters.flavor_profile);
            }

            if (filters.course) {
                dishes = dishes.filter(dish => dish.course === filters.course);
            }

            if (filters.state) {
                dishes = dishes.filter(dish => dish.state === filters.state);
            }

            if (filters.region) {
                dishes = dishes.filter(dish => dish.region === filters.region);
            }

            if (filters.maxPrepTime !== undefined) {
                dishes = dishes.filter(dish => dish.prep_time <= filters.maxPrepTime!);
            }

            if (filters.maxCookTime !== undefined) {
                dishes = dishes.filter(dish => dish.cook_time <= filters.maxCookTime!);
            }

            return dishes;
        } catch (error) {
            console.error('Error filtering dishes:', error);
            return [];
        }
    }
};

// ===== User Model =====

export const UserModel = {
    // Get all users
    getAll: (): User[] => {
        ensureFileExists(USERS_FILE);

        try {
            const data = fs.readFileSync(USERS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    },

    // Get user by ID
    getById: (id: string): User | null => {
        ensureFileExists(USERS_FILE);

        try {
            const data = fs.readFileSync(USERS_FILE, 'utf-8');
            const users: User[] = JSON.parse(data);
            const user = users.find(u => u.id === id);
            return user || null;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    },

    // Get user by email
    getByEmail: (email: string): User | null => {
        ensureFileExists(USERS_FILE);

        try {
            const data = fs.readFileSync(USERS_FILE, 'utf-8');
            const users: User[] = JSON.parse(data);
            const user = users.find(u => u.email === email);
            return user || null;
        } catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    },

    // Create a new user
    create: (userData: { username: string; email: string; password: string; }): User => {
        ensureFileExists(USERS_FILE);

        try {
            const data = fs.readFileSync(USERS_FILE, 'utf-8');
            const users: User[] = JSON.parse(data);

            const newUser: User = {
                id: crypto.randomUUID(),
                username: userData.username,
                email: userData.email,
                password: userData.password, // This should be hashed before saving
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            users.push(newUser);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }
};