'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    //id: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    RestaurantId: DataTypes.INTEGER,
    TourId: DataTypes.INTEGER,
    BlogId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Restaurant)
    Comment.belongsTo(models.Tour)
    Comment.belongsTo(models.Attraction)
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Blog)
  };
  return Comment;
};
