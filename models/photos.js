'use strict';
module.exports = (sequelize, DataTypes) => {
  const Photos = sequelize.define('Photos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    RestaurantId: DataTypes.INTEGER,
    AttractionId: DataTypes.INTEGER,
    ShopId: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {});
  Photos.associate = function(models) {
    // associations can be defined here
    Photos.belongsTo(models.Restaurant)
    Photos.belongsTo(models.Attraction)
    Photos.belongsTo(models.Shop)
  };
  return Photos;
};
