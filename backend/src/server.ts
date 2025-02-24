import app from './app';
import path from 'path';
import fs from 'fs';

// Check if dishes.json exists, if not, notify user to run seed script
const dishesJsonPath = path.join(__dirname, 'data', 'dishes.json');
if (!fs.existsSync(dishesJsonPath)) {
    console.warn('Warning: dishes.json does not exist. Please run the seed script:');
    console.warn('npm run seed');
}

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API: http://localhost:${PORT}/api`);
});