'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    //id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Comment)
    User.hasMany(models.Tour)
    User.hasMany(models.Blog)
    User.hasMany(models.Like)
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FvoritedRestaurants'
    })
    User.belongsToMany(models.Attraction, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FvoritedAttractions'
    })
    User.belongsToMany(models.Tour, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FvoritedTours'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedRestaurants'
    })
    User.belongsToMany(models.Attraction, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'LikedAttractions'
    })
    User.belongsToMany(models.Tour, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'LikedTours'
    })
  };
  return User;
};
