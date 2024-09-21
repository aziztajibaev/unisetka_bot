const { Pool } = require('pg');
const config = require('../../config/config'); // Adjust the path as needed

const pool = new Pool(config.DB_CONFIG);

class Order {
    constructor(data) {
        this.order_id = data.order_id;
        this.user_id = data.user_id;
        this.amount = data.amount;
        this.curr_rate = data.curr_rate;
        this.deal_date = data.deal_date;
        this.is_paid = data.is_paid;
        this.status = data.status;
        this.additional_size = data.additional_size;
        this.period = data.period;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM orders');
        return result.rows.map(row => new Order(row));
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [id]);
        return result.rows.length ? new Order(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO orders (user_id, amount, curr_rate, is_paid, status, additional_size, period) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [this.user_id, this.amount, this.curr_rate, this.is_paid, this.status, this.additional_size, this.period]
        );
        Object.assign(this, result.rows[0]);
    }

    async update() {
        const result = await pool.query(
            'UPDATE orders SET user_id = $1, amount = $2, curr_rate = $3, is_paid = $4, status = $5, additional_size = $6, period = $7 WHERE order_id = $8 RETURNING *',
            [this.user_id, this.amount, this.curr_rate, this.is_paid, this.status, this.additional_size, this.period, this.order_id]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM orders WHERE order_id = $1', [id]);
    }

    static async getOrderWithItems(orderId) {
        const orderResult = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        if (!orderResult.rows.length) {
            return null;
        }
        
        const orderItemsResult = await pool.query('SELECT * FROM order_items WHERE deal_id = $1', [orderId]);
        const order = new Order(orderResult.rows[0]);

        return {
            ...order, // Spread order properties
            order_items: orderItemsResult.rows // Include order items
        };
    }
}

module.exports = Order;
