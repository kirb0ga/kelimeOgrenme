const { Word, UserWordStatus, UserWord, UserSettings } = require('../models');
const { Op, fn, Sequelize } = require('sequelize');
const moment = require('moment-timezone');

const getQuizWords = async (req, res) => {
    const userId = req.user.id;

    try {
        const lastQuiz = await UserWordStatus.findOne({
            where: { user_id: userId },
            order: [['last_quiz_date', 'DESC']],
        });

        if (lastQuiz) {
            const lastQuizTime = moment.tz(lastQuiz.last_quiz_date, 'Europe/Istanbul');
            const now = moment.tz('Europe/Istanbul');
            const diff = now.diff(lastQuizTime, 'hours');
            if (diff < 24) {
                const nextQuizTime = lastQuizTime.add(24, 'hours');
                const remainingTime = nextQuizTime.diff(now, 'seconds');
                return res.status(200).json({ message: 'Quiz already taken today', remainingTime });
            }
        }

        const now = moment.tz('Europe/Istanbul');

        const dueWords = await UserWordStatus.findAll({
            where: {
                user_id: userId,
                next_test_date: {
                    [Op.lte]: now.toDate(),
                },
                correct_count: {
                    [Op.lt]: 7,
                },
            },
            include: {
                model: Word,
                required: true,
            },
        });

        const dueWordIds = dueWords.map(word => word.word_id);

        const userSettings = await UserSettings.findOne({ where: { user_id: userId } });
        const dailyWordCount = userSettings ? userSettings.daily_word_count : 10;

        let newWords = await Word.findAll({
            where: {
                id: { [Op.notIn]: dueWordIds },
            },
            limit: dailyWordCount,
            order: fn('RANDOM'),
        });

        if (newWords.length < dailyWordCount) {
            // Correct countu 0 olan kelimeleri yeniden kullanma durumunu words tablosundaki kelimeler biterse kullanılsın şeklinde ekledim.
            const additionalWords = await Word.findAll({
                where: {
                    id: { [Op.notIn]: dueWordIds },
                    id: { [Op.notIn]: newWords.map(word => word.id) },
                    id: {
                        [Op.in]: Sequelize.literal(`
                            SELECT word_id
                            FROM user_word_status
                            WHERE user_id = ${userId}
                            AND correct_count = 0
                            AND next_test_date IS NULL
                        `)
                    }
                },
                limit: dailyWordCount - newWords.length,
                order: fn('RANDOM'),
            });

            newWords = [...newWords, ...additionalWords];
        }

        const quizWords = [...dueWords.map(word => word.Word), ...newWords];

        res.json(quizWords);
    } catch (error) {
        console.error('Fetch quiz words error:', error.message);
        res.status(500).send('Server error');
    }
};

const updateWordStatus = async (req, res) => {
    const userId = req.user.id;
    const { wordId, isCorrect } = req.body;

    console.log('Request received:', { userId, wordId, isCorrect });

    try {
        const userWordStatus = await UserWordStatus.findOne({
            where: { user_id: userId, word_id: wordId }
        });

        console.log('User word status found:', userWordStatus);

        const now = moment().tz('Europe/Istanbul');

        if (!userWordStatus) {
            
            const initialCorrectCount = isCorrect ? 1 : 0;
            const nextTestDate = isCorrect ? calculateNextTestDate(initialCorrectCount, now) : null;

            await UserWordStatus.create({
                user_id: userId,
                word_id: wordId,
                last_correct_date: isCorrect ? now : null,
                correct_count: initialCorrectCount,
                next_test_date: nextTestDate,
                last_quiz_date: now,
                next_quiz_date: now.clone().add(24, 'hours')
            });

            return res.json({ msg: 'New word status created' });
        }

        if (isCorrect) {
            if (userWordStatus.correct_count < 6) {
                const correctCount = userWordStatus.correct_count + 1;
                const nextTestDate = calculateNextTestDate(correctCount, now);

                await UserWordStatus.update({
                    last_correct_date: now,
                    correct_count: correctCount,
                    next_test_date: nextTestDate,
                    last_quiz_date: now,
                    next_quiz_date: now.clone().add(24, 'hours')
                }, {
                    where: { id: userWordStatus.id }
                });
            } else {
                await UserWord.create({
                    user_id: userId,
                    word_id: wordId,
                    createdAt: now,
                    updatedAt: now
                });

                await UserWordStatus.destroy({
                    where: { user_id: userId, word_id: wordId }
                });
            }
        } else {
            await UserWordStatus.update({
                correct_count: 0,
                next_test_date: null,
                last_quiz_date: now,
                next_quiz_date: now.clone().add(24, 'hours')
            }, {
                where: { id: userWordStatus.id }
            });
        }

        res.json({ msg: 'Word status updated' });
    } catch (error) {
        console.error('Update word status error:', error.message);
        res.status(500).send('Server error');
    }
};

const completeQuiz = async (req, res) => {
    const userId = req.user.id;
    try {
        const now = moment.tz('Europe/Istanbul');

        await UserWordStatus.update(
            { last_quiz_date: now, next_quiz_date: now.clone().add(24, 'hours') },
            { where: { user_id: userId } }
        );

        res.json({ msg: 'Quiz completed' });
    } catch (error) {
        console.error('Complete quiz error:', error.message);
        res.status(500).send('Server error');
    }
};

const calculateNextTestDate = (correctCount, now) => {
    switch (correctCount) {
        case 1:
            return now.clone().add(1, 'days');
        case 2:
            return now.clone().add(1, 'weeks');
        case 3:
            return now.clone().add(1, 'months');
        case 4:
            return now.clone().add(3, 'months');
        case 5:
            return now.clone().add(6, 'months');
        case 6:
            return now.clone().add(1, 'years');
        default:
            return now.clone().add(1, 'days');
    }
};

module.exports = {
    getQuizWords,
    updateWordStatus,
    completeQuiz,
};
