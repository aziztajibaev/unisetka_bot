// src/api/controllers/orderController.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

// Create a new order
exports.createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { user_id, amount, curr_rate, is_paid, status, additional_size, period, items } = req.body;

        // Create the order
        const orderResult = await client.query(
            'INSERT INTO orders (user_id, amount, curr_rate, is_paid, status, additional_size, period) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, amount, curr_rate, is_paid, status, additional_size, period]
        );

        const orderId = orderResult.rows[0].order_id;

        // Insert order items
        const orderItemsPromises = items.map(item => {
            return client.query(
                'INSERT INTO order_items (deal_id, height, width, quantity, price, amount, color_id, raw_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [orderId, item.height, item.width, item.quantity, item.price, item.amount, item.color_id, item.raw_id]
            );
        });

        await Promise.all(orderItemsPromises);
        await client.query('COMMIT');

        res.status(201).json(orderResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).send('Server error');
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const orderResult = await pool.query('SELECT * FROM orders WHERE order_id = $1', [id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        const itemsResult = await pool.query('SELECT * FROM order_items WHERE deal_id = $1', [id]);
        res.status(200).json({ order: orderResult.rows[0], items: itemsResult.rows });
    } catch (err) {
        console.error('Error retrieving order:', err);
        res.status(500).send('Server error');
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { amount, curr_rate, is_paid, status, additional_size, period } = req.body;

    try {
        const result = await pool.query(
            'UPDATE orders SET amount = $1, curr_rate = $2, is_paid = $3, status = $4, additional_size = $5, period = $6 WHERE order_id = $7 RETURNING *',
            [amount, curr_rate, is_paid, status, additional_size, period, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).send('Server error');
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        await pool.query('DELETE FROM order_items WHERE deal_id = $1', [id]); // Delete associated items
        res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).send('Server error');
    }
};
