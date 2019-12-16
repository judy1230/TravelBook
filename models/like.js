'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    //id: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    TourId: DataTypes.INTEGER,
    BlogId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.User)
    Like.belongsTo(models.Tour)
    Like.belongsTo(models.Restaurant)
    Like.belongsTo(models.Attraction)
    Like.belongsTo(models.Blog)
  };
  return Like;
};
