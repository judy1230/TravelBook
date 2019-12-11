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
  User.associate = function (models) {
    User.hasMany(models.Comment)
    User.hasMany(models.Tour)
    User.hasMany(models.Blog)
    User.hasMany(models.Like)
    User.hasMany(models.Favorite)
    User.hasMany(models.Component)
    User.belongsToMany(models.Tour {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedTour'
    })
    User.belongsToMany(models.Attraction {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedAttraction'
    })
    User.belongsToMany(models.Restaurant {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedRestaurant'
    })
    User.belongsToMany(models.Blog {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedBlog'
    })
    User.belongsToMany(models.Restaurant {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedRestaurant'
    })
    User.belongsToMany(models.Blog {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedBlog'
    })
    User.belongsToMany(models.Tour {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTour'
    })
    User.belongsToMany(models.Attraction {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedAttraction'
    })
    User.belongsToMany(models.Restaurant {
      through: models.Component,
      foreignKey: 'UserId',
      as: 'ComponentRestaurants'
    })
    User.belongsToMany(models.Attraction {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'ComponentAttraction'
    })
  };
  return User;
};
