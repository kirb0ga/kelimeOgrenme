const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Quiz', {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
