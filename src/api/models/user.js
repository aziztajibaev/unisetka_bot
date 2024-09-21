const { Pool } = require('pg');
const config = require('../../config/config'); // Adjust the path as needed

const pool = new Pool(config.DB_CONFIG);

class User {
    constructor(data) {
        this.user_id = data.user_id;
        this.chat_id = data.chat_id;
        this.name = data.name;
        this.phone_number = data.phone_number;
        this.username = data.username;
        this.is_admin = data.is_admin;
        this.status = data.status;
        this.password = data.password;
        this.menu_type = data.menu_type;
        this.lang = data.lang;
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM users');
        return result.rows.map(row => new User(row));
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        return result.rows.length ? new User(result.rows[0]) : null;
    }

    async save() {
        const result = await pool.query(
            'INSERT INTO users (chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [this.chat_id, this.name, this.phone_number, this.username, this.is_admin, this.status, this.password, this.menu_type, this.lang]
        );
        Object.assign(this, result.rows[0]); // Update the model with the new data
    }

    async update() {
        const result = await pool.query(
            'UPDATE users SET chat_id = $1, name = $2, phone_number = $3, username = $4, is_admin = $5, status = $6, password = $7, menu_type = $8, lang = $9 WHERE user_id = $10 RETURNING *',
            [this.chat_id, this.name, this.phone_number, this.username, this.is_admin, this.status, this.password, this.menu_type, this.lang, this.user_id]
        );
        Object.assign(this, result.rows[0]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    }
}

module.exports = User;
