'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    RestaurantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TourId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BlogId: {
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
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Restaurant)
    Comment.belongsTo(models.Tour)
    Comment.belongsTo(models.Attraction)
    Comment.belongsTo(models.Shopping)
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Blog)
  };
  return Comment;
};
