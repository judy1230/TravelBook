'use strict';
module.exports = (sequelize, DataTypes) => {
  const Photos = sequelize.define('Photos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    restaurantId: DataTypes.INTEGER,
    attractionId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
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
