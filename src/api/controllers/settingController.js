const Setting = require('../models/setting');

const getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve settings' });
    }
};

const getSettingByCode = async (req, res) => {
    try {
        const setting = await Setting.findByCode(req.params.code);
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve setting' });
    }
};

const createSetting = async (req, res) => {
    try {
        const setting = new Setting(req.body);
        await setting.save();
        res.status(201).json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create setting' });
    }
};

const updateSetting = async (req, res) => {
    try {
        const setting = await Setting.findByCode(req.params.code);
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        Object.assign(setting, req.body);
        await setting.update();
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update setting' });
    }
};

const deleteSetting = async (req, res) => {
    try {
        await Setting.delete(req.params.code);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete setting' });
    }
};

module.exports = {
    getAllSettings,
    getSettingByCode,
    createSetting,
    updateSetting,
    deleteSetting
};
