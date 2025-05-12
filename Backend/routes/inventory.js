const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all inventory levels
router.get('/', auth, async (req, res) => {
  try {
    const [inventory] = await db.query(`
      SELECT i.inventoryId, i.productId, i.quantity, p.name, p.sku, p.minimumStock 
      FROM Inventory i 
      JOIN Products p ON i.productId = p.productId
    `);
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products for dropdown
router.get('/products', auth, async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT productId, name, sku 
      FROM Products
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products for inventory:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update stock (add or remove)
router.post('/update', auth, async (req, res) => {
  const { productId, quantity, type, notes } = req.body;
  const userId = req.user.userId; // From JWT
  if (!productId || !quantity || !type) {
    return res.status(400).json({ message: 'Product ID, quantity, and type are required' });
  }
  if (!['ADD', 'REMOVE'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }
  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive' });
  }

  try {
    // Check if product exists in inventory
    const [inventory] = await db.query('SELECT * FROM Inventory WHERE productId = ?', [productId]);
    if (inventory.length === 0) {
      // Initialize inventory for new product
      await db.query('INSERT INTO Inventory (productId, quantity) VALUES (?, ?)', [productId, 0]);
    }

    // Prevent negative quantities for REMOVE
    if (type === 'REMOVE') {
      const [current] = await db.query('SELECT quantity FROM Inventory WHERE productId = ?', [productId]);
      if (current[0].quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock to remove' });
      }
    }

    // Update inventory
    const updateQuery = type === 'ADD'
      ? 'UPDATE Inventory SET quantity = quantity + ?, updatedAt = NOW() WHERE productId = ?'
      : 'UPDATE Inventory SET quantity = quantity - ?, updatedAt = NOW() WHERE productId = ?';
    const [result] = await db.query(updateQuery, [quantity, productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found in inventory' });
    }

    // Log stock movement
    await db.query(
      'INSERT INTO StockMovements (productId, quantity, type, notes, userId) VALUES (?, ?, ?, ?, ?)',
      [productId, quantity, type, notes || null, userId]
    );

    res.json({ message: 'Stock updated' });
  } catch (error) {
    console.error('Error updating stock:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard data (low stock, total inventory value, total products, total categories)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Low stock items
    const [lowStock] = await db.query(`
      SELECT p.productId, p.name, p.sku, p.minimumStock, i.quantity 
      FROM Products p 
      JOIN Inventory i ON p.productId = i.productId 
      WHERE i.quantity <= p.minimumStock
    `);

    // Total inventory value
    const [totalValueResult] = await db.query(`
      SELECT SUM(p.price * i.quantity) as totalValue 
      FROM Products p 
      JOIN Inventory i ON p.productId = i.productId
    `);

    // Total products
    const [totalProductsResult] = await db.query('SELECT COUNT(*) as count FROM Products');

    // Total categories
    const [totalCategoriesResult] = await db.query('SELECT COUNT(*) as count FROM Categories');

    const response = {
      lowStock,
      totalValue: Number(totalValueResult[0].totalValue) || 0,
      totalProducts: Number(totalProductsResult[0].count) || 0,
      totalCategories: Number(totalCategoriesResult[0].count) || 0,
    };

    console.log('Dashboard response:', response); // Log response for debugging

    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;