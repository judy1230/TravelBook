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
    Tour.hasMany(models.Comment)
    Tour.hasMany(models.Favorite)
    Tour.hasMany(models.Like)
    Tour.belongsTo(models.Location)
    Tour.belongsTo(models.User)
    Tour.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'TourId',
      as: 'FavoritedUser'
    })
    Tour.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TourId',
      as: 'LikedUser'
    })
  };
  return Tour;
};
