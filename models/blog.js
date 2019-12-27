'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    TourId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    tag: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Blog.associate = function(models) {
    // associations can be defined here
    Blog.hasMany(models.Comment)
    Blog.hasMany(models.Like)
    Blog.belongsTo(models.Tour)
    Blog.belongsTo(models.User)
    Blog.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'BlogId',
      as: 'LikedUser'
    })
  };
  return Blog;
};
