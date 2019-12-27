'use strict';
module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('Component', {
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
    AttractionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ShopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Lat: {
      type: DataTypes.STRING
    },
    Lng: {
      type: DataTypes.STRING
    },
  }, {});
  Component.associate = function(models) {
    // associations can be defined here
    Component.belongsTo(models.User)
    Component.belongsTo(models.Restaurant)
    Component.belongsTo(models.Attraction)
    Component.belongsTo(models.Shop)
  };
  return Component;
};
