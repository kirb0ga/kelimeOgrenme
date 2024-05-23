require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const reportRoutes = require('./routes/report');
const wordRoutes = require('./routes/words');
const settingsRoutes = require('./routes/settings');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/settings', settingsRoutes);

sequelize.authenticate().then(() => {
  console.log('Database connected...');
  return sequelize.sync();
}).then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
