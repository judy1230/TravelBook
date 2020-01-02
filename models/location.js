'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,

  }, {});
  Location.associate = function(models) {
    // associations can be defined here
    //Location.hasMany(models.Restaurant)
    //Location.hasMany(models.Attraction)
    //Location.hasMany(models.Shop)
    Location.hasMany(models.Tour)
    Location.hasMany(models.Blog)
  };
  return Location;
};
