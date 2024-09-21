const Raw = require('../models/raw');

class RawController {
    // Get all raws
    static async getAllRaws(req, res) {
        try {
            const raws = await Raw.findAll();
            res.json(raws);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve raws' });
        }
    }

    // Get raw by ID
    static async getRawById(req, res) {
        const { id } = req.params;
        try {
            const raw = await Raw.findById(id);
            if (raw) {
                res.json(raw);
            } else {
                res.status(404).json({ error: 'Raw not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve raw' });
        }
    }

    // Create new raw
    static async createRaw(req, res) {
        const { name, price } = req.body;
        const newRaw = new Raw({ name, price });
        try {
            await newRaw.save();
            res.status(201).json(newRaw);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create raw' });
        }
    }

    // Update raw
    static async updateRaw(req, res) {
        const { id } = req.params;
        const { name, price } = req.body;
        try {
            const raw = await Raw.findById(id);
            if (raw) {
                raw.name = name;
                raw.price = price;
                await raw.update();
                res.json(raw);
            } else {
                res.status(404).json({ error: 'Raw not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update raw' });
        }
    }

    // Delete raw
    static async deleteRaw(req, res) {
        const { id } = req.params;
        try {
            await Raw.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete raw' });
        }
    }
}

module.exports = RawController;
