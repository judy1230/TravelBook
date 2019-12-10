'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attraction = sequelize.define('Attraction', {
    //id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    LocationId: DataTypes.INTEGER,
    favoritedCount: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Attraction.associate = function(models) {
    // associations can be defined here
    Attraction.hasMany(models.Comment)
    Attraction.belongsTo(models.Location)
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

  };
  return Attraction;
};
