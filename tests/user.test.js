const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('User Module Tests', () => {
    beforeAll(async () => {
        // Clear users collection before tests
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // TC001: Test user registration with valid data
    test('TC001: Should register new user successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.name).toBe('Test User');
        expect(res.body.user.email).toBe('test@example.com');
    });

    // TC002: Test registration with duplicate email
    test('TC002: Should not register user with duplicate email', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password456'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });

    // TC003: Test login with valid credentials
    test('TC003: Should login successfully with valid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
    });

    // TC004: Test login with incorrect password
    test('TC004: Should not login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    // TC019: Test required field validation
    test('TC019: Should validate required fields on registration', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors.length).toBeGreaterThan(0);
    });

    // Test protected route access
    test('Should access protected route with valid token', async () => {
        // First login to get token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const token = loginRes.body.token;

        // Test accessing protected route
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Test User');
    });

    // Test protected route without token
    test('Should not access protected route without token', async () => {
        const res = await request(app)
            .get('/api/users/me');

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, authorization denied');
    });
}); 