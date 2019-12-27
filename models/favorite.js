'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER,
    ShopId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
    Favorite.belongsTo(models.User)
    Favorite.belongsTo(models.Restaurant)
    Favorite.belongsTo(models.Attraction)
    Favorite.belongsTo(models.Shop)
  };
  return Favorite;
};
