const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    securityQuestion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    securityAnswer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
