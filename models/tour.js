'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define('Tour', {
    //id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    days: DataTypes.STRING,
    tag: DataTypes.STRING,
    favoritedCount: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Tour.associate = function(models) {
    // associations can be defined here
    Tour.belongsTo(models.User)
  };
  return Tour;
};
