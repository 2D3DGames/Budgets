import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { createTransaction, updateTransaction } from '../services/api';

const TransactionForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (initialData) {
        await updateTransaction(initialData._id, formData);
      } else {
        await createTransaction(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving the transaction');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Salary',
    'Investment',
    'Other'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        select
        fullWidth
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        margin="normal"
        required
      >
        <MenuItem value="expense">Expense</MenuItem>
        <MenuItem value="income">Income</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        margin="normal"
        required
        inputProps={{ min: 0, step: "0.01" }}
      />

      <TextField
        select
        fullWidth
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        margin="normal"
        required
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
      />

      <TextField
        fullWidth
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (initialData ? 'Update' : 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionForm; 