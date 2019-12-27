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
    ShopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Restaurant)
    Comment.belongsTo(models.Attraction)
    Comment.belongsTo(models.Shop)
    Comment.belongsTo(models.User)
    Comment.belongsTo(models.Blog)
    Comment.belongsTo(models.Tour)
  };
  return Comment;
};
