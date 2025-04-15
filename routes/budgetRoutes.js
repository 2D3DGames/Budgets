const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const budgetValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
    body('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
    body('category').trim().notEmpty().withMessage('Category is required')
];

// Get all budgets for authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { user: req.user.id };

        // Add date range filter if provided
        if (startDate && endDate) {
            query.startDate = { $gte: new Date(startDate) };
            query.endDate = { $lte: new Date(endDate) };
        }

        const budgets = await Budget.find(query).sort({ startDate: -1 });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new budget
router.post('/', auth, budgetValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, amount, startDate, endDate, category } = req.body;

        // Check for overlapping budgets in the same category
        const overlapping = await Budget.findOne({
            user: req.user.id,
            category,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlapping) {
            return res.status(400).json({
                message: 'An overlapping budget exists for this category and date range'
            });
        }

        const budget = await Budget.create({
            user: req.user.id,
            title,
            amount,
            startDate,
            endDate,
            category
        });

        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single budget by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json(budget);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update budget
router.put('/:id', auth, budgetValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, amount, startDate, endDate, category } = req.body;

        // Check if budget exists and belongs to user
        let budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Check for overlapping budgets, excluding current budget
        const overlapping = await Budget.findOne({
            _id: { $ne: req.params.id },
            user: req.user.id,
            category,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlapping) {
            return res.status(400).json({
                message: 'An overlapping budget exists for this category and date range'
            });
        }

        budget.title = title;
        budget.amount = amount;
        budget.startDate = startDate;
        budget.endDate = endDate;
        budget.category = category;

        await budget.save();
        res.json(budget);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        await budget.deleteOne();
        res.json({ message: 'Budget removed' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Get budgets by category
router.get('/category/:category', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({
            user: req.user.id,
            category: req.params.category
        }).sort({ startDate: -1 });

        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 