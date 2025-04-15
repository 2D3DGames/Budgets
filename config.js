module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/budget_tracker',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: '24h'
}; 