// src/api/controllers/rawController.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

// Create a new raw
exports.create = async (req, res) => {
    try {
        const { name, price } = req.body;
        const result = await pool.query(
            'INSERT INTO raws (name, price) VALUES ($1, $2) RETURNING *',
            [name, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating raw:', err);
        res.status(500).send('Server error');
    }
};

// Get all raws
exports.getAll = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM raws');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving raws:', err);
        res.status(500).send('Server error');
    }
};

// Get a raw by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM raws WHERE raw_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Raw not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving raw:', err);
        res.status(500).send('Server error');
    }
};

// Update a raw by ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const result = await pool.query(
            'UPDATE raws SET name = $1, price = $2 WHERE raw_id = $3 RETURNING *',
            [name, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Raw not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating raw:', err);
        res.status(500).send('Server error');
    }
};

// Delete a raw by ID
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM raws WHERE raw_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Raw not found' });
        }

        res.status(200).json({ msg: 'Raw deleted successfully' });
    } catch (err) {
        console.error('Error deleting raw:', err);
        res.status(500).send('Server error');
    }
};
