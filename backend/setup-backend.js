/**
 * This script sets up the backend environment
 * - It creates necessary directories
 * - Copies the CSV file to the data directory
 * - Runs the conversion utility to generate the JSON file
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
// Define paths
const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src/data');
const csvSourcePath = path.join(rootDir, 'indian_food.csv');
const csvDestPath = path.join(srcDir, 'indian_food.csv');

console.log('Setting up backend environment...');

// Create directory structure if not exists
if (!fs.existsSync(srcDir)) {
  console.log('Creating src directory...');
  fs.mkdirSync(srcDir);
}

if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
}

// Copy CSV file to data directory
if (fs.existsSync(csvSourcePath)) {
  console.log('Copying CSV file to data directory...');
  fs.copyFileSync(csvSourcePath, csvDestPath);
} else {
  console.error(`CSV file not found at ${csvSourcePath}`);
  console.error('Please ensure the indian_food.csv file is in the project root directory');
  process.exit(1);
}

// Run the conversion utility to generate JSON file
console.log('Converting CSV to JSON...');
exec('npx ts-node src/utils/csv-to-json.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running conversion utility: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Conversion utility stderr: ${stderr}`);
    return;
  }
  
  console.log(stdout);
  console.log('Backend setup completed successfully!');
  console.log('You can now start the backend server');
});