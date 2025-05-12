import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Alert } from '../styles/Common';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../App';

// Styled components for the dashboard
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px;
  color: #1e3a8a;
  font-size: 1.2rem;
`;

const CardValue = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
`;

const AlertSection = styled.div`
  margin-top: 20px;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    lowStock: [],
    totalValue: 0,
    totalProducts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, redirecting to login');
      toast.error('Please log in to access the dashboard');
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/inventory/dashboard');
        setDashboardData({
          lowStock: res.data.lowStock || [],
          totalValue: Number(res.data.totalValue) || 0,
          totalProducts: Number(res.data.totalProducts) || 0,
          totalCategories: Number(res.data.totalCategories) || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error.message);
        toast.error(error.response?.data?.message || 'Failed to load dashboard data');
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };
    fetchDashboardData();
  }, [navigate, logout]);

  return (
    <Container>
      <h2>Dashboard</h2>
      <DashboardGrid>
        <Card>
          <CardTitle>Total Products</CardTitle>
          <CardValue>{dashboardData.totalProducts}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Categories</CardTitle>
          <CardValue>{dashboardData.totalCategories}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Inventory Value</CardTitle>
          <CardValue>${(dashboardData.totalValue || 0).toFixed(2)}</CardValue>
        </Card>
      </DashboardGrid>
      <AlertSection>
        {dashboardData.lowStock.length > 0 ? (
          <Alert type="error">
            <h3>Low Stock Alerts</h3>
            <ul>
              {dashboardData.lowStock.map((item) => (
                <li key={item.productId}>
                  {item.name} (SKU: {item.sku}) - Quantity: {item.quantity}, Minimum: {item.minimumStock}
                </li>
              ))}
            </ul>
          </Alert>
        ) : (
          <Alert type="success">
            <h3>No Low Stock Alerts</h3>
            <p>All products are sufficiently stocked.</p>
          </Alert>
        )}
      </AlertSection>
    </Container>
  );
};

export default Dashboard; 