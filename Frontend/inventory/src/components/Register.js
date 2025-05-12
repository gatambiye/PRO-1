import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Input, Button } from '../styles/Common';
import { toast } from 'react-toastify';
import api from '../api';

// Styled components
const FormCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 400px;
  width: 100%;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h2`
  text-align: center;
  color: #1e3a8a;
  font-size: 1.8rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Label = styled.label`
  color: #111827;
  font-size: 0.9rem;
  font-weight: 500;
`;

const StyledInput = styled(Input)`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #f59e0b;
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  background: #1e3a8a;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f59e0b;
  }

  &:disabled {
    background: #6b7280;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: #111827;
  font-size: 0.9rem;
  margin-top: 15px;

  a {
    color: #1e3a8a;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: #f59e0b;
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValidForm = () => {
    return (
      username.length >= 3 &&
      email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      password.length >= 6
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      toast.error('Please enter a valid username (3+ chars), email, and password (6+ chars)');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/register', { username, password, email });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Register</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username">Username</Label>
            <StyledInput
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <StyledInput
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <StyledInput
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>
          <StyledButton type="submit" disabled={submitting || !isValidForm()}>
            {submitting ? 'Registering...' : 'Register'}
          </StyledButton>
        </Form>
        <LinkText>
          Already have an account? <Link to="/login">Login</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
};

export default Register;