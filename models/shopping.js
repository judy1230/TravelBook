'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shopping = sequelize.define('Shopping', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    LocationId: DataTypes.INTEGER,
    viewCounts: DataTypes.STRING
  }, {});
  Shopping.associate = function (models) {
    // associations can be defined here
    Shopping.hasMany(models.Comment)
    Shopping.hasMany(models.Component)
    Shopping.hasMany(models.Like)
    Shopping.hasMany(models.Favorite)
    Shopping.belongsTo(models.Location)
    Shopping.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'ShoppingId',
      as: 'FavoritedUsers'
    })
    Shopping.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'ShoppingId',
      as: 'LikedUsers'
    })
    Shopping.belongsToMany(models.User, {
      through: models.Component,
      foreignKey: 'ShoppingId',
      as: 'ComponentUsers'
    })
  };
  return Shopping;
}
