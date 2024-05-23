const { pool } = require('../config/db');

exports.addWord = async (req, res) => {
  const { english, turkish, sentences1, sentences2, sentences3, image, pronunciation } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO words (english, turkish, sentences1, sentences2, sentences3, image, pronunciation) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [english, turkish, sentences1, sentences2, sentences3, image, pronunciation]
    );

    const word = result.rows[0];
    res.status(201).json(word);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getWords = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM words');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
