module.exports = (sequelize, DataTypes) => {
    const UserWordStatus = sequelize.define('UserWordStatus', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        word_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Words',
                key: 'id'
            }
        },
        last_correct_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        correct_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        next_test_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        last_quiz_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        next_quiz_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'createdat'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updatedat'
        }
    }, {
        timestamps: true,
        tableName: 'user_word_status'
    });

    return UserWordStatus;
};
