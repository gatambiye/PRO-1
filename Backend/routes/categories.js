const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM Categories');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add category
router.post('/', auth, async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    try {
        await db.query('INSERT INTO Categories (name, description) VALUES (?, ?)', [name, description || null]);
        res.status(201).json({ message: 'Category added' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update category
router.put('/:id', auth, async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    try {
        const [result] = await db.query('UPDATE Categories SET name = ?, description = ?, updatedAt = NOW() WHERE categoryId = ?', [name, description || null, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category updated' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Categories WHERE categoryId = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;