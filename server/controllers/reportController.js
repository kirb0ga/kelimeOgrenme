const { UserWords, Word } = require('../models');
const { Op } = require('sequelize');

const getReport = async (req, res) => {
    const userId = req.user.id;

    try {
        const learnedWords = await UserWords.findAll({
            where: { user_id: userId },
            include: {
                model: Word,
                required: true,
            },
        });

        const allWords = await Word.findAll();

        const levelCounts = {};
        const correctCounts = {};

        allWords.forEach(word => {
            const level = word.level;
            if (!levelCounts[level]) {
                levelCounts[level] = 0;
                correctCounts[level] = 0;
            }
            levelCounts[level]++;
        });

        learnedWords.forEach(entry => {
            const level = entry.Word.level;
            if (!correctCounts[level]) {
                correctCounts[level] = 0;
            }
            correctCounts[level]++;
        });

        const levelSuccessRates = [];
        for (const level in levelCounts) {
            const totalWords = levelCounts[level];
            const knownWords = correctCounts[level];
            const successRate = (knownWords / totalWords) * 100;
            levelSuccessRates.push({
                level,
                totalWords,
                knownWords,
                successRate
            });
        }

        res.json(levelSuccessRates);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getReport,
};
