const { Pool } = require('pg');
const config = require('../../config/config'); // Adjust the path as needed

const pool = new Pool(config.DB_CONFIG);

class Color {
    constructor(data) {
        this.color_id = data.color_id;
        this.name = data.name;
        this.price = data.price;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM colors');
        return result.rows.map(row => new Color(row));
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM colors WHERE color_id = $1', [id]);
        return result.rows.length ? new Color(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO colors (name, price) VALUES ($1, $2) RETURNING *',
            [this.name, this.price]
        );
        Object.assign(this, result.rows[0]); // Update the model with the new data
    }

    async update() {
        const result = await pool.query(
            'UPDATE colors SET name = $1, price = $2 WHERE color_id = $3 RETURNING *',
            [this.name, this.price, this.color_id]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM colors WHERE color_id = $1', [id]);
    }
}

module.exports = Color;
