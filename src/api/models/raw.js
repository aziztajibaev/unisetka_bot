const { Pool } = require('pg');
const config = require('../../config/config'); // Adjust the path as needed

const pool = new Pool(config.DB_CONFIG);

class Raw {
    constructor(data) {
        this.raw_id = data.raw_id;
        this.name = data.name;
        this.price = data.price;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM raws');
        return result.rows.map(row => new Raw(row));
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM raws WHERE raw_id = $1', [id]);
        return result.rows.length ? new Raw(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO raws (name, price) VALUES ($1, $2) RETURNING *',
            [this.name, this.price]
        );
        Object.assign(this, result.rows[0]); // Update the model with the new data
    }

    async update() {
        const result = await pool.query(
            'UPDATE raws SET name = $1, price = $2 WHERE raw_id = $3 RETURNING *',
            [this.name, this.price, this.raw_id]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM raws WHERE raw_id = $1', [id]);
    }
}

module.exports = Raw;
