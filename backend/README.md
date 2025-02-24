# Indian Cuisine Explorer API

A RESTful API for exploring Indian cuisine, built with Express.js and TypeScript.

## Features

- Browse all dishes in the database
- Search dishes by name
- Find dishes by available ingredients
- Filter dishes by various criteria
- User authentication with JWT

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd indian-cuisine-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory using the `.env.example` as a template:
   ```
   cp .env.example .env
   ```

4. Run the data seed script to convert the CSV to JSON:
   ```
   npm run seed
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Start the server:
   ```
   npm start
   ```

   For development with hot-reloading:
   ```
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register a New User
- **POST** `/api/auth/register`
- **Body:** `{ "username": "string", "email": "string", "password": "string" }`
- **Response:** User data and JWT token

#### Login
- **POST** `/api/auth/login`
- **Body:** `{ "email": "string", "password": "string" }`
- **Response:** User data and JWT token

### Dish Endpoints

#### Get All Dishes (with pagination)
- **GET** `/api/dishes?page=1&limit=10&sortBy=name&sortOrder=asc`
- **Response:** Paginated list of dishes

#### Get Dish by ID
- **GET** `/api/dishes/:id`
- **Response:** Dish details

#### Search Dishes by Name
- **GET** `/api/dishes/search/name?q=dosa`
- **Response:** List of matching dishes

#### Find Dishes by Ingredients
- **POST** `/api/dishes/by-ingredients`
- **Body:** `{ "ingredients": ["rice", "coconut", "jaggery"] }`
- **Response:** List of dishes that can be made

#### Filter Dishes
- **GET** `/api/dishes/filter?diet=vegetarian&flavor_profile=sweet&region=South`
- **Query Parameters:**
  - `diet`: vegetarian or non vegetarian
  - `flavor_profile`: sweet, spicy, etc.
  - `course`: main course, dessert, etc.
  - `state`: Any Indian state
  - `region`: North, South, East, West, etc.
  - `maxPrepTime`: Maximum preparation time in minutes
  - `maxCookTime`: Maximum cooking time in minutes
- **Response:** List of dishes matching the criteria

## Project Structure

```
indian-cuisine-api/
├── src/
│   ├── data/
│   │   ├── indian_food.csv     # Original data file
│   │   └── dishes.json         # Converted JSON data (generated)
│   ├── middleware.ts           # All middlewares (auth, error handling, etc.)
│   ├── models.ts               # Data models and types
│   ├── routes.ts               # All API routes 
│   ├── utils.ts                # Utility functions (CSV parsing, auth, etc.)
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## License

This project is licensed under the MIT License.