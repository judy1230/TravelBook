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
    RestaurantId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER,
    lat: DataTypes.STRING,
    Lng: DataTypes.STRING
  }, {});
  Component.associate = function(models) {
    // associations can be defined here
    Component.belongsTo(models.User)
    Component.belongsTo(models.Restaurant)
    Component.belongsTo(models.Attraction)
  };
  return Component;
};
