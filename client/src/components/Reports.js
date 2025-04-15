import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const mockData = {
  monthlyExpenses: [
    { month: 'Jan', amount: 2500 },
    { month: 'Feb', amount: 2300 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 2400 },
  ],
  categoryBreakdown: [
    { name: 'Food', value: 800 },
    { name: 'Rent', value: 1500 },
    { name: 'Utilities', value: 300 },
    { name: 'Entertainment', value: 200 },
  ],
  budgetVsActual: [
    { category: 'Food', budget: 1000, actual: 800 },
    { category: 'Rent', budget: 1500, actual: 1500 },
    { category: 'Utilities', budget: 400, actual: 300 },
    { category: 'Entertainment', budget: 300, actual: 200 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Reports() {
  const [period, setPeriod] = useState('monthly');

  return (
    <Container>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Financial Reports
            </Typography>
            <TextField
              select
              label="Period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ minWidth: 200, mb: 3 }}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>
          </Grid>

          {/* Monthly Expenses Trend */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Expenses Trend
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={mockData.monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>

          {/* Category Breakdown */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Expense by Category
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={mockData.categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {mockData.categoryBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>

          {/* Budget vs Actual */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Budget vs Actual
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={mockData.budgetVsActual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" />
                    <Bar dataKey="actual" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Reports; 