'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    //id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    TourId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    tag: DataTypes.STRING,
    favoritedCount: DataTypes.STRING,
    likedCount: DataTypes.STRING,
  }, {});
  Blog.associate = function(models) {
    // associations can be defined here
    Blog.hasMany(models.Comment)
    Blog.hasMany(models.Like)
    Blog.hasMany(models.Favorite)
    Blog.belongsTo(models.Tour)
    Blog.belongsTo(models.User)
    Blog.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'BlogId',
      as: 'LikedUser'
    })
    Blog.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'BlogId',
      as: 'FavoritedUser'
    })
  };
  return Blog;
};
