const express = require('express');
const { Word } = require('../models');
const auth = require('../middleware/auth');
const { Op, fn, col } = require('sequelize');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const words = await Word.findAll();
        res.json(words);
    } catch (error) {
        console.error('Fetch words error:', error.message);
        res.status(500).send('Server error');
    }
});

router.post('/', auth, async (req, res) => {
    const { english, turkish, sentences1, sentences2, sentences3, pronunciation, image, level } = req.body;

    try {
        const newWord = await Word.create({
            english,
            turkish,
            sentences1,
            sentences2,
            sentences3,
            pronunciation,
            image,
            level
        });

        res.json(newWord);
    } catch (error) {
        console.error('Create word error:', error.message);
        res.status(500).send('Server error');
    }
});

router.get('/random', auth, async (req, res) => {
    try {
        const randomWords = await Word.findAll({
            order: fn('RANDOM'),
            limit: 3
        });
        res.json(randomWords);
    } catch (error) {
        console.error('Fetch random words error:', error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
