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
    RestaurantId:
    {
      type: DataTypes.INTEGER,
      allowNull: true,
      },
    TourId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BlogId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AttractionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ShoppingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
    Favorite.belongsTo(models.User)
    Favorite.belongsTo(models.Tour)
    Favorite.belongsTo(models.Restaurant)
    Favorite.belongsTo(models.Attraction)
    Favorite.belongsTo(models.Shopping)
    Favorite.belongsTo(models.Blog)
  };
  return Favorite;
};
