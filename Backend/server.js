const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Import database connection
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const stockRoutes = require('./routes/stock');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        await db.query('SELECT 1');
        res.status(200).json({ status: 'OK', message: 'Server and database are running' });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock', stockRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Initialize database connection and start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Test database connection
        await db.query('SELECT 1');
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();