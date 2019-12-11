'use strict';
module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('Component', {
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER
  }, {});
  Component.associate = function(models) {
    // associations can be defined here
    Component.belongsTo(models.User)
    Component.belongsTo(models.Restaurant)
    Component.belongsTo(models.Attraction)
  };
  return Component;
};
