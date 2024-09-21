const Color = require('../models/color');

class ColorController {
    // Get all colors
    static async getAllColors(req, res) {
        try {
            const colors = await Color.findAll();
            res.json(colors);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve colors' });
        }
    }

    // Get color by ID
    static async getColorById(req, res) {
        const { id } = req.params;
        try {
            const color = await Color.findById(id);
            if (color) {
                res.json(color);
            } else {
                res.status(404).json({ error: 'Color not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve color' });
        }
    }

    // Create new color
    static async createColor(req, res) {
        const { name, price } = req.body;
        const newColor = new Color({ name, price });
        try {
            await newColor.save();
            res.status(201).json(newColor);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create color' });
        }
    }

    // Update color
    static async updateColor(req, res) {
        const { id } = req.params;
        const { name, price } = req.body;
        try {
            const color = await Color.findById(id);
            if (color) {
                color.name = name;
                color.price = price;
                await color.update();
                res.json(color);
            } else {
                res.status(404).json({ error: 'Color not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update color' });
        }
    }

    // Delete color
    static async deleteColor(req, res) {
        const { id } = req.params;
        try {
            await Color.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete color' });
        }
    }
}

module.exports = ColorController;
