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
    ShoppingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {});
  Component.associate = function(models) {
    // associations can be defined here
    Component.belongsTo(models.User)
    Component.belongsTo(models.Restaurant)
    Component.belongsTo(models.Attraction)
    Component.belongsTo(models.Shopping)
  };
  return Component;
};
