'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define('Tour', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    temp: DataTypes.BOOLEAN,
    startMinInit: DataTypes.INTEGER,
    startHourInit: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    endDuration: DataTypes.STRING,
    endLocation: DataTypes.STRING,
    endTime: DataTypes.STRING,
    date: DataTypes.STRING,
    days: DataTypes.STRING,
    favoriteCount: DataTypes.STRING,
    tourComponents: DataTypes.JSON,
  }, {});
  Tour.associate = function(models) {
    // associations can be defined here
    Tour.hasMany(models.Comment)
    Tour.hasMany(models.Blog)
    Tour.hasMany(models.Like)
   // Tour.belongsTo(models.Location)
    Tour.belongsTo(models.User)
    Tour.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'TourId',
      as: 'LikedUser'
    })
  };
  return Tour;
};
