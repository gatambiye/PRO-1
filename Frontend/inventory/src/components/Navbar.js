import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../styles/Common';
import { toast } from 'react-toastify';
import { setAuthToken } from '../api';

const Nav = styled.nav`
  background: #1e3a8a;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Logo = styled.h1`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f59e0b;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    text-align: center;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f59e0b;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <Nav>
      <Logo onClick={() => navigate('/dashboard')}>TECKTONA INVENTORY</Logo>
      <NavLinks>
        <NavLink onClick={() => navigate('/dashboard')}>Dashboard</NavLink>
        <NavLink onClick={() => navigate('/categories')}>Categories</NavLink>
        <NavLink onClick={() => navigate('/products')}>Products</NavLink>
        <NavLink onClick={() => navigate('/inventory')}>Inventory</NavLink>
        <Button onClick={handleLogout}>Logout</Button>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;