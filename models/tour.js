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
    tourComponents: {
      allowNull: false,
      type: DataTypes.JSON
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Tour.associate = function(models) {
    // associations can be defined here
  };
  return Tour;
};
