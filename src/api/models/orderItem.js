// src/api/models/orderItem.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

class OrderItem {
    constructor(data) {
        this.item_id = data.item_id;
        this.deal_id = data.deal_id;
        this.height = data.height;
        this.width = data.width;
        this.quantity = data.quantity;
        this.price = data.price;
        this.amount = data.amount;
        this.color_id = data.color_id;
        this.raw_id = data.raw_id;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM order_items');
        return result.rows.map(row => new OrderItem(row));
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM order_items WHERE item_id = $1', [id]);
        return result.rows.length ? new OrderItem(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO order_items (deal_id, height, width, quantity, price, amount, color_id, raw_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [this.deal_id, this.height, this.width, this.quantity, this.price, this.amount, this.color_id, this.raw_id]
        );
        Object.assign(this, result.rows[0]);
    }

    async update() {
        const result = await pool.query(
            'UPDATE order_items SET deal_id = $1, height = $2, width = $3, quantity = $4, price = $5, amount = $6, color_id = $7, raw_id = $8 WHERE item_id = $9 RETURNING *',
            [this.deal_id, this.height, this.width, this.quantity, this.price, this.amount, this.color_id, this.raw_id, this.item_id]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM order_items WHERE item_id = $1', [id]);
    }
}

module.exports = OrderItem;
