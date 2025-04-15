const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Get monthly summary
router.get('/monthly-summary/:userId', async (req, res) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const transactions = await Transaction.find({
            user: req.params.userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const summary = {
            income: 0,
            expenses: 0,
            categories: {}
        };

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                summary.income += transaction.amount;
            } else {
                summary.expenses += transaction.amount;
                if (!summary.categories[transaction.category]) {
                    summary.categories[transaction.category] = 0;
                }
                summary.categories[transaction.category] += transaction.amount;
            }
        });

        summary.balance = summary.income - summary.expenses;

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get budget vs actual comparison
router.get('/budget-vs-actual/:userId', async (req, res) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const budgets = await Budget.find({
            user: req.params.userId,
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        });

        const transactions = await Transaction.find({
            user: req.params.userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const comparison = budgets.map(budget => {
            const categoryTransactions = transactions.filter(
                t => t.category === budget.category
            );
            const actualAmount = categoryTransactions.reduce(
                (sum, t) => sum + (t.type === 'expense' ? t.amount : 0),
                0
            );

            return {
                category: budget.category,
                budgeted: budget.amount,
                actual: actualAmount,
                difference: budget.amount - actualAmount
            };
        });

        res.json(comparison);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get category-wise spending
router.get('/category-spending/:userId', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const transactions = await Transaction.find({
            user: req.params.userId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            type: 'expense'
        });

        const categorySpending = {};
        transactions.forEach(transaction => {
            if (!categorySpending[transaction.category]) {
                categorySpending[transaction.category] = 0;
            }
            categorySpending[transaction.category] += transaction.amount;
        });

        res.json(categorySpending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 