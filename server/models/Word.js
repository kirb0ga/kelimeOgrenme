const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Word = sequelize.define('Word', {
        english: {
            type: DataTypes.STRING,
            allowNull: false
        },
        turkish: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pronunciation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sentences1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sentences2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sentences3: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'words',
        timestamps: false
    });

    return Word;
};
