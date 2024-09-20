// src/api/controllers/colorController.js
const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool(config.DB_CONFIG);

// Create a new color
exports.create = async (req, res) => {
    try {
        const { name, price } = req.body;
        const result = await pool.query(
            'INSERT INTO colors (name, price) VALUES ($1, $2) RETURNING *',
            [name, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating color:', err);
        res.status(500).send('Server error');
    }
};

// Get all colors
exports.getAll = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colors');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving colors:', err);
        res.status(500).send('Server error');
    }
};

// Get a color by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM colors WHERE color_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Color not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving color:', err);
        res.status(500).send('Server error');
    }
};

// Update a color by ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const result = await pool.query(
            'UPDATE colors SET name = $1, price = $2 WHERE color_id = $3 RETURNING *',
            [name, price, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Color not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating color:', err);
        res.status(500).send('Server error');
    }
};

// Delete a color by ID
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM colors WHERE color_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Color not found' });
        }

        res.status(200).json({ msg: 'Color deleted successfully' });
    } catch (err) {
        console.error('Error deleting color:', err);
        res.status(500).send('Server error');
    }
};
