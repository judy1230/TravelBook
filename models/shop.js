'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
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
    opening_up: DataTypes.INTEGER,
    opening_down: DataTypes.INTEGER,
    image: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    stayTime: DataTypes.INTEGER,
    rating: DataTypes.STRING,
    viewCounts: DataTypes.STRING,
    Location: DataTypes.STRING
  }, {});
  Shop.associate = function(models) {
    // associations can be defined here
    Shop.hasMany(models.Comment)
    Shop.hasMany(models.Photos)
    Shop.hasMany(models.Component)
    Shop.hasMany(models.Favorite)
    Shop.hasMany(models.Like)
    //Shop.belongsTo(models.Location)
    Shop.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'ShopId',
      as: 'FavoritedUsers'
    })
    Shop.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'ShopId',
      as: 'LikedUsers'
    })
    Shop.belongsToMany(models.User, {
      through: models.Component,
      foreignKey: 'ShopId',
      as: 'ComponentUsers'
    })

  };
  return Shop;
};
