import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  background: #1E3A8A;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: #1E40AF;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #6B7280;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #1E3A8A;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #1E3A8A;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #E5E7EB;
  }

  th {
    background: #F1F5F9;
    font-weight: 600;
    color: #1F2937;
  }

  tr:hover {
    background: #F9FAFB;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 8px;
      font-size: 14px;
    }
  }
`;

export const Alert = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin: 10px 0;
  background: ${(props) => (props.type === 'error' ? '#FEE2E2' : '#D1FAE5')};
  color: ${(props) => (props.type === 'error' ? '#B91C1C' : '#065F46')};
  border: 1px solid ${(props) => (props.type === 'error' ? '#EF4444' : '#10B981')};

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;