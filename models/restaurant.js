'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    //id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    LocationId: DataTypes.INTEGER,
    favoritedCount: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Restaurant.associate = function(models) {
    // associations can be defined here
    Restaurant.hasMany(models.Comment)
    Restaurant.belongsTo(models.Location)
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
  };
  return Restaurant;
};
