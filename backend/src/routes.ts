import { Router, Request, Response } from 'express';
import { DishModel, UserModel, PaginationOptions, DishFilters } from './models';
import { hashPassword, verifyPassword, generateToken } from './utils';
import { authenticate, authorize } from './middleware';

const router = Router();

// ===== Authentication Routes =====

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/auth/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = UserModel.getByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = UserModel.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(user);

        // Return user info without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});

/**
 * Login
 * POST /api/auth/login
 */
router.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = UserModel.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user info without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});

// ===== Dish Routes =====

/**
 * Get all dishes with pagination
 * GET /api/dishes
 */
router.get('/dishes', (req: Request, res: Response) => {
    try {
        // Parse pagination options
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const sortBy = req.query.sortBy as string;
        const sortOrder = req.query.sortOrder as 'asc' | 'desc';

        const options: PaginationOptions = {
            page,
            limit,
            sortBy,
            sortOrder
        };

        // Get dishes
        const result = DishModel.getAll(options);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting dishes:', error);
        res.status(500).json({ message: 'Failed to retrieve dishes' });
    }
});

/**
 * Get dish by ID
 * GET /api/dishes/:id
 */
router.get('/dishes/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get dish
        const dish = DishModel.getById(id);

        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        res.status(200).json(dish);
    } catch (error) {
        console.error('Error getting dish by ID:', error);
        res.status(500).json({ message: 'Failed to retrieve dish' });
    }
});

/**
 * Search dishes by name
 * GET /api/dishes/search/name?q=<query>
 */
router.get('/dishes/search/name', (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Search dishes
        const dishes = DishModel.searchByName(query);

        res.status(200).json({ results: dishes });
    } catch (error) {
        console.error('Error searching dishes:', error);
        res.status(500).json({ message: 'Failed to search dishes' });
    }
});

/**
 * Find dishes by ingredients
 * POST /api/dishes/by-ingredients
 * Body: { ingredients: string[] }
 */
router.post('/dishes/by-ingredients', (req: Request, res: Response) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: 'Ingredients array is required' });
        }

        // Find dishes
        const dishes = DishModel.findByIngredients(ingredients);

        res.status(200).json({ results: dishes });
    } catch (error) {
        console.error('Error finding dishes by ingredients:', error);
        res.status(500).json({ message: 'Failed to find dishes by ingredients' });
    }
});

/**
 * Filter dishes
 * GET /api/dishes/filter
 * Query params: diet, flavor_profile, course, state, region, maxPrepTime, maxCookTime
 */
router.get('/dishes/filter', (req: Request, res: Response) => {
    try {
        const filters: DishFilters = {
            diet: req.query.diet as 'vegetarian' | 'non vegetarian' | undefined,
            flavor_profile: req.query.flavor_profile as string | undefined,
            course: req.query.course as string | undefined,
            state: req.query.state as string | undefined,
            region: req.query.region as string | undefined,
            maxPrepTime: req.query.maxPrepTime ? parseInt(req.query.maxPrepTime as string, 10) : undefined,
            maxCookTime: req.query.maxCookTime ? parseInt(req.query.maxCookTime as string, 10) : undefined
        };

        // Filter dishes
        const dishes = DishModel.filter(filters);

        res.status(200).json({ results: dishes });
    } catch (error) {
        console.error('Error filtering dishes:', error);
        res.status(500).json({ message: 'Failed to filter dishes' });
    }
});

export default router;