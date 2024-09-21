const { Pool } = require('pg');
const config = require('../../config/config'); // Adjust the path as needed

const pool = new Pool(config.DB_CONFIG);

class Setting {
    constructor(data) {
        this.code = data.code;
        this.value = data.value;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM settings');
        return result.rows.map(row => new Setting(row));
    }

    static async findByCode(code) {
        const result = await pool.query('SELECT * FROM settings WHERE code = $1', [code]);
        return result.rows.length ? new Setting(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO settings (code, value) VALUES ($1, $2) RETURNING *',
            [this.code, this.value]
        );
        Object.assign(this, result.rows[0]);
    }

    async update() {
        const result = await pool.query(
            'UPDATE settings SET value = $1 WHERE code = $2 RETURNING *',
            [this.value, this.code]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(code) {
        await pool.query('DELETE FROM settings WHERE code = $1', [code]);
    }
}

module.exports = Setting;
