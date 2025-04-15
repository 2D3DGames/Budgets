const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const transactionValidation = [
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Amount must be greater than 0');
            }
            return true;
        }),
    body('type')
        .trim()
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('date')
        .isISO8601()
        .toDate()
        .withMessage('Valid date is required'),
    body('description').optional().trim()
];

// Create a new transaction
router.post('/', auth, transactionValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const transaction = await Transaction.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all transactions for authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const { startDate, endDate, type, category } = req.query;
        let query = { user: req.user.id };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (type) {
            query.type = type;
        }

        if (category) {
            query.category = category;
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single transaction
router.get('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a transaction
router.put('/:id', auth, transactionValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 