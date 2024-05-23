const Sequelize = require('sequelize');
const UserModel = require('./User');
const WordModel = require('./Word');
const UserWordStatusModel = require('./UserWordStatus');
const UserSettingsModel = require('./UserSettings');
const UserWordModel = require('./UserWord'); 

const sequelize = new Sequelize('kelime_ogrenme', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

const User = UserModel(sequelize, Sequelize);
const Word = WordModel(sequelize, Sequelize);
const UserWordStatus = UserWordStatusModel(sequelize, Sequelize);
const UserSettings = UserSettingsModel(sequelize, Sequelize);
const UserWords = UserWordModel(sequelize, Sequelize); 

User.hasMany(UserWordStatus, { foreignKey: 'user_id' });
Word.hasMany(UserWordStatus, { foreignKey: 'word_id' });

UserWordStatus.belongsTo(User, { foreignKey: 'user_id' });
UserWordStatus.belongsTo(Word, { foreignKey: 'word_id' });

User.hasOne(UserSettings, { foreignKey: 'user_id' }); 
User.hasMany(UserWords, { foreignKey: 'user_id' }); 
Word.hasMany(UserWords, { foreignKey: 'word_id' }); 
UserWords.belongsTo(User, { foreignKey: 'user_id' }); 
UserWords.belongsTo(Word, { foreignKey: 'word_id' }); 

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = {
    User,
    Word,
    UserWordStatus,
    UserSettings,
    UserWords 
};
