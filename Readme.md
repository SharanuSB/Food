# Indian Cuisine Explorer

## Project Setup

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/SharanuSB/Food.git
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

### Testing Login Credentials

#### Default Test Accounts

1. Test User
- Email: `sharanusb12345@gmail.com`
- Password: `Sharanu@1032`

### Seeding Dishes

#### Script to Add Dishes
```bash
cd backend
cd src/data and run node csvToJson.ts file
```

This script will:
- Clear existing dishes
- Add dishes from the predefined CSV file
- Populate the database with Indian cuisine dishes

### Environment Variables

Ensure to create `.env` files in both backend and frontend directories with necessary configurations.

### Troubleshooting
- Ensure all dependencies are installed
- Verify Node.js and npm versions

## Project Structure
- `backend/`: Express.js server
- `frontend/`: React application
- `data/`: Contains CSV and seed data

## Technologies Used
- Backend: Express.js, TypeScript
- Frontend: React, TypeScript
- Database: JSON File-based storage
- Styling: Tailwind CSS

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request