const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('UserWords', {
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
        model: 'words',
        key: 'id'
      }
    }
  });
};
