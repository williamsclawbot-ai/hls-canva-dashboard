import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function SalesChart() {
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlyTrends();
  }, []);

  const fetchMonthlyTrends = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/sales/trends');
      setMonthlyTrends(response.data.monthly_trends || []);
    } catch (err) {
      setError('Failed to fetch sales trends');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading">Loading sales chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="error">{error}</div>
        <button 
          className="button button-primary" 
          onClick={fetchMonthlyTrends}
          style={{ marginTop: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!monthlyTrends || monthlyTrends.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading">No sales data available</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', padding: '2rem 0' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
        📈 Sales Trend - All Time
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyTrends}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '0.875rem' }}
            label={{ value: 'Sales/Revenue ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '1rem' }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 5 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            name="Monthly Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
