const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.*, c.name as categoryName 
            FROM Products p 
            LEFT JOIN Categories c ON p.categoryId = c.categoryId
        `);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add product
router.post('/', auth, async (req, res) => {
    const { name, sku, description, categoryId, price, minimumStock, imageUrl } = req.body;
    if (!name || !sku || !price) {
        return res.status(400).json({ message: 'Name, SKU, and price are required' });
    }

    try {
        await db.query(
            'INSERT INTO Products (name, sku, description, categoryId, price, minimumStock, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, sku, description || null, categoryId, price, minimumStock || 0, imageUrl || null]
        );
        res.status(201).json({ message: 'Product added' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update product
router.put('/:id', auth, async (req, res) => {
    const { name, sku, description, categoryId, price, minimumStock, imageUrl } = req.body;
    const { id } = req.params;
    if (!name || !sku || !price) {
        return res.status(400).json({ message: 'Name, SKU, and price are required' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Products SET name = ?, sku = ?, description = ?, categoryId = ?, price = ?, minimumStock = ?, imageUrl = ?, updatedAt = NOW() WHERE productId = ?',
            [name, sku, description || null, categoryId, price, minimumStock || 0, imageUrl || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Products WHERE productId = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;