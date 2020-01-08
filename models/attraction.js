'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attraction = sequelize.define('Attraction', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    stayTime: DataTypes.INTEGER,
    rating: DataTypes.STRING,
    Location: DataTypes.STRING,
    viewCounts: DataTypes.STRING
  }, {});
  Attraction.associate = function(models) {
    // associations can be defined here
    Attraction.hasMany(models.Comment)
    Attraction.hasMany(models.Photos)
    Attraction.hasMany(models.Component)
    Attraction.hasMany(models.Favorite)
    Attraction.hasMany(models.Like)
    //Attraction.belongsTo(models.Location)
    Attraction.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'AttractionId',
      as: 'FavoritedUsers'
    })
    Attraction.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'AttractionId',
      as: 'LikedUsers'
    })
    Attraction.belongsToMany(models.User, {
      through: models.Component,
      foreignKey: 'AttractionId',
      as: 'ComponentUsers'
    })

  };
  return Attraction;
};
