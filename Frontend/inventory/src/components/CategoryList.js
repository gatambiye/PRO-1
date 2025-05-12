import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Input, Button, Table } from '../styles/Common';
import { toast } from 'react-toastify';
import api from '../api';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name, description });
        toast.success('Category updated');
      } else {
        await api.post('/categories', { name, description });
        toast.success('Category added');
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setDescription(category.description || '');
    setEditingId(category.categoryId);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Container>
      <h2>Manage Categories</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">{editingId ? 'Update' : 'Add'} Category</Button>
      </Form>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.name}</td>
              <td>{category.description || '-'}</td>
              <td>
                <Button onClick={() => handleEdit(category)}>Edit</Button>
                <Button onClick={() => handleDelete(category.categoryId)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CategoryList;