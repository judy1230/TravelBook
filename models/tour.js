'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define('Tour', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    days: DataTypes.STRING,
    tag: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Tour.associate = function(models) {
    // associations can be defined here
    Tour.hasMany(models.Comment)
    Tour.hasMany(models.Blog)
    Tour.hasMany(models.Like)
    Tour.belongsTo(models.Location)
    Tour.belongsTo(models.User)
    Tour.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TourId',
      as: 'LikedUser'
    })
  };
  return Tour;
};
