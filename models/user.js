'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Comment)
    User.hasMany(models.Tour)
    User.hasMany(models.Blog)
    User.hasMany(models.Like)
    User.hasMany(models.Favorite)
    User.hasMany(models.Component)
    User.belongsToMany(models.Tour, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedTours'
    })
    User.belongsToMany(models.Attraction, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedAttractions'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedRestaurants'
    })
    User.belongsToMany(models.Blog, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedBlogs'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedRestaurants'
    })
    User.belongsToMany(models.Blog, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedBlogs'
    })
    User.belongsToMany(models.Tour, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTours'
    })
    User.belongsToMany(models.Attraction, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedAttractions'
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Component,
      foreignKey: 'UserId',
      as: 'ComponentRestaurants'
    })
    User.belongsToMany(models.Attraction, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'ComponentAttractions'
    })
  };
  return User;
};
