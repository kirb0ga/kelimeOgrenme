module.exports = (sequelize, DataTypes) => {
    const UserSettings = sequelize.define('UserSettings', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users', 
                key: 'id'
            }
        },
        daily_word_count: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        }
    }, {
        timestamps: false
    });

    return UserSettings;
};
