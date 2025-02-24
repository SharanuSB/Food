import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Dish, User } from './models';
import crypto from 'crypto';

// File paths
const CSV_FILE = path.join(__dirname, 'data', 'indian_food.csv');
const JSON_FILE = path.join(__dirname, 'data', 'dishes.json');

// ===== Authentication Utilities =====

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Verify a password
 */
export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token
 */
export const generateToken = (user: User): string => {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
    );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
};

// ===== CSV to JSON Conversion =====

/**
 * Parse CSV line into array of values
 */
const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    // Add the last value
    values.push(currentValue.trim());

    return values;
};

/**
 * Parse ingredients string into array
 */
const parseIngredients = (ingredientsString: string): string[] => {
    return ingredientsString
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient !== '');
};

/**
 * Convert CSV file to JSON
 */
export const convertCSVToJSON = async (): Promise<void> => {
    console.log('Converting CSV to JSON...');

    // Ensure data directory exists
    const dataDir = path.dirname(JSON_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    try {
        // Read the CSV file
        const fileContent = fs.readFileSync(CSV_FILE, 'utf-8');
        const lines = fileContent.split(/\r?\n/);

        // Parse headers
        const headers = parseCSVLine(lines[0]);

        // Parse data rows
        const dishes: Dish[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);
            if (values.length !== headers.length) {
                console.warn(`Skipping line ${i + 1}: inconsistent column count`);
                continue;
            }

            // Create an object from headers and values
            const rowData: Record<string, any> = {};
            headers.forEach((header, index) => {
                rowData[header] = values[index];
            });

            // Parse ingredients
            const ingredients = parseIngredients(rowData.ingredients);

            // Create dish object
            const dish: Dish = {
                id: crypto.randomUUID(),
                name: rowData.name,
                ingredients,
                diet: rowData.diet as 'vegetarian' | 'non vegetarian',
                prep_time: parseInt(rowData.prep_time, 10) || 0,
                cook_time: parseInt(rowData.cook_time, 10) || 0,
                flavor_profile: rowData.flavor_profile,
                course: rowData.course,
                state: rowData.state,
                region: rowData.region
            };

            dishes.push(dish);
        }

        // Write to JSON file
        fs.writeFileSync(JSON_FILE, JSON.stringify(dishes, null, 2));

        console.log(`Successfully converted ${dishes.length} dishes to JSON`);
    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
    }
};

// Run seed function if called directly with "seed" argument
if (require.main === module && process.argv[2] === 'seed') {
    convertCSVToJSON()
        .then(() => {
            console.log('Seeding completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}