const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const crypto = require('crypto');

// Function to convert CSV to JSON
const convertCsvToJson = () => {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, 'indian_food.csv'))
            .pipe(csv())
            .on('data', (data: any) => {
                // Convert numeric fields to numbers
                data.prep_time = Number(data.prep_time);
                data.cook_time = Number(data.cook_time);

                // Split ingredients into an array
                data.ingredients = data.ingredients
                    .split(',')
                    .map((ingredient: string) => ingredient.trim())
                    .filter((ingredient: string) => ingredient !== '');

                // Generate a unique ID for the dish
                data.id = crypto.randomUUID();

                results.push(data);
            })
            .on('end', () => {
                // Write the parsed data to a JSON file
                fs.writeFile(
                    path.resolve(__dirname, 'dishes.json'),
                    JSON.stringify(results, null, 2),
                    (err: any) => {
                        if (err) {
                            console.error('Error writing JSON file:', err);
                            reject(err);
                        } else {
                            console.log(`Successfully converted CSV to JSON`);
                            console.log(`Total records processed: ${results.length}`);
                            resolve(void 0);
                        }
                    }
                );
            })
            .on('error', (error: any) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

// If you want to run this as a standalone script
if (require.main === module) {
    convertCsvToJson()
        .then(() => process.exit(0))
        .catch((err: any) => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = convertCsvToJson;