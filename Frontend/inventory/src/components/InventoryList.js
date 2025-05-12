import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Input, Select, Button, Table } from '../styles/Common';
import { toast } from 'react-toastify';
import api from '../api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: '', quantity: '', type: 'ADD', notes: '' });

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/inventory/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId || !form.quantity || form.quantity <= 0) {
      toast.error('Please select a product and enter a positive quantity');
      return;
    }
    try {
      await api.post('/inventory/update', {
        ...form,
        quantity: parseInt(form.quantity, 10)
      });
      toast.success('Stock updated');
      setForm({ productId: '', quantity: '', type: 'ADD', notes: '' });
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <Container>
      <h2>Manage Inventory</h2>
      <Button onClick={() => { fetchInventory(); fetchProducts(); }} style={{ marginBottom: '20px' }}>
        Refresh Data
      </Button>
      <Form onSubmit={handleSubmit}>
        <Select name="productId" value={form.productId} onChange={handleChange}>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </Select>
        <Input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          min="1"
        />
        <Select name="type" value={form.type} onChange={handleChange}>
          <option value="ADD">Add Stock</option>
          <option value="REMOVE">Remove Stock</option>
        </Select>
        <Input
          type="text"
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />
        <Button type="submit">Update Stock</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Minimum Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.inventoryId}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.quantity}</td>
              <td>{item.minimumStock}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default InventoryList;