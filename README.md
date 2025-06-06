# Budget Tracker Application

A comprehensive budget tracking application that helps users manage their finances effectively.

## Features

- User Authentication (Register/Login)
- Budget Management
- Transaction Tracking
- Financial Reports
- Category-wise Spending Analysis
- Budget vs Actual Comparison

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Frontend: React (to be implemented)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/budget-tracker
   JWT_SECRET=your-secret-key
   ```

4. Start MongoDB server

5. Run the application:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### Budgets
- POST /api/budgets - Create a new budget
- GET /api/budgets/user/:userId - Get all budgets for a user
- GET /api/budgets/:id - Get a single budget
- PUT /api/budgets/:id - Update a budget
- DELETE /api/budgets/:id - Delete a budget

### Transactions
- POST /api/transactions - Create a new transaction
- GET /api/transactions/user/:userId - Get all transactions for a user
- GET /api/transactions/:id - Get a single transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Delete a transaction

### Reports
- GET /api/reports/monthly-summary/:userId - Get monthly summary
- GET /api/reports/budget-vs-actual/:userId - Get budget vs actual comparison
- GET /api/reports/category-spending/:userId - Get category-wise spending

## Security

- All routes except login and register are protected with JWT authentication
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive information

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request #   B u d g e t s  
 