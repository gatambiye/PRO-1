import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Input, Select, Button, Table } from '../styles/Common';
import { toast } from 'react-toastify';
import api from '../api';

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', sku: '', description: '', categoryId: '', price: '', minimumStock: '', imageUrl: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product added');
      }
      setForm({ name: '', sku: '', description: '', categoryId: '', price: '', minimumStock: '', imageUrl: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categoryId: product.categoryId || '',
      price: product.price,
      minimumStock: product.minimumStock || '',
      imageUrl: product.imageUrl || ''
    });
    setEditingId(product.productId);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Container>
      <h2>Manage Products</h2>
      <Form onSubmit={handleSubmit}>
        <Input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <Input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
        <Input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
          ))}
        </Select>
        <Input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <Input type="number" name="minimumStock" placeholder="Minimum Stock" value={form.minimumStock} onChange={handleChange} />
        <Input type="text" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
        <Button type="submit">{editingId ? 'Update' : 'Add'} Product</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>${product.price}</td>
              <td>{product.categoryName || '-'}</td>
              <td>
                <Button onClick={() => handleEdit(product)}>Edit</Button>
                <Button onClick={() => handleDelete(product.productId)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductList;