'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    //id: DataTypes.INTEGER,
    name: DataTypes.STRING,

  }, {});
  Location.associate = function(models) {
    // associations can be defined here
    Location.hasMany(models.Restaurant)
    Location.hasMany(models.Attraction)
    Location.hasMany(models.Tour)
  };
  return Location;
};
