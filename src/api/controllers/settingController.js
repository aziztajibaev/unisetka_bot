// src/api/controllers/settingsController.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

// Create a new setting
exports.create = async (req, res) => {
    try {
        const { code, value } = req.body;
        const result = await pool.query(
            'INSERT INTO settings (code, value) VALUES ($1, $2) RETURNING *',
            [code, value]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating setting:', err);
        res.status(500).send('Server error');
    }
};

// Get all settings
exports.getAll = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM settings');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving settings:', err);
        res.status(500).send('Server error');
    }
};

// Get a setting by code
exports.getByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const result = await pool.query('SELECT * FROM settings WHERE code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Setting not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving setting:', err);
        res.status(500).send('Server error');
    }
};

// Update a setting by code
exports.update = async (req, res) => {
    try {
        const { code } = req.params;
        const { value } = req.body;

        const result = await pool.query(
            'UPDATE settings SET value = $1 WHERE code = $2 RETURNING *',
            [value, code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Setting not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating setting:', err);
        res.status(500).send('Server error');
    }
};

// Delete a setting by code
exports.delete = async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query('DELETE FROM settings WHERE code = $1 RETURNING *', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Setting not found' });
        }

        res.status(200).json({ msg: 'Setting deleted successfully' });
    } catch (err) {
        console.error('Error deleting setting:', err);
        res.status(500).send('Server error');
    }
};
