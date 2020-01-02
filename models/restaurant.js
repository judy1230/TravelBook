'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    Location: DataTypes.STRING,
    viewCounts: DataTypes.STRING,
    stayTime: DataTypes.INTEGER,
    rating: DataTypes.STRING,
  }, {});
  Restaurant.associate = function(models) {
    // associations can be defined here
    Restaurant.hasMany(models.Comment)
    Restaurant.hasMany(models.Component)
    Restaurant.hasMany(models.Favorite)
    Restaurant.hasMany(models.Like)
    //Restaurant.belongsTo(models.Location)
    Restaurant.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'RestaurantId',
      as: 'FavoritedUsers'
    })
    Restaurant.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'RestaurantId',
      as: 'LikedUsers'
    })
    Restaurant.belongsToMany(models.User, {
      through: models.Component,
      foreignKey: 'RestaurantId',
      as: 'ComponentUsers'
    })
  };
  return Restaurant;
};
