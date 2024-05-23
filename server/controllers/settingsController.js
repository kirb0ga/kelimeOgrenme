const { UserSettings } = require('../models');

const getSettings = async (req, res) => {
    const userId = req.user.id;

    try {
        const settings = await UserSettings.findOne({
            where: { user_id: userId }
        });

        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateSettings = async (req, res) => {
    const userId = req.user.id;
    const { daily_word_count } = req.body;

    try {
        const [settings, created] = await UserSettings.upsert({
            user_id: userId,
            daily_word_count: daily_word_count
        });

        res.json({ message: 'Settings updated', settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
