const express = require('express');
const { getQuizWords, updateWordStatus, completeQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getQuizWords);
router.post('/update', auth, updateWordStatus);
router.post('/complete', auth, completeQuiz);

module.exports = router;
