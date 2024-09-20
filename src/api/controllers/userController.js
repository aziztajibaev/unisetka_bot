// src/api/controllers/userController.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

exports.create = async (req, res) => {
    const { chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang } = req.body;
    const result = await pool.query(
        'INSERT INTO users (chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang]
    );
    res.status(201).json(result.rows[0]);
};

exports.getAll = async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang } = req.body;
    const result = await pool.query(
        'UPDATE users SET chat_id = $1, name = $2, phone_number = $3, username = $4, is_admin = $5, status = $6, password = $7, menu_type = $8, lang = $9 WHERE user_id = $10 RETURNING *',
        [chat_id, name, phone_number, username, is_admin, status, password, menu_type, lang, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
};
