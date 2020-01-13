'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      temp: {
        type: Sequelize.BOOLEAN
      },
      startMinInit: {
        type: Sequelize.INTEGER
      },
      startHourInit: {
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      endDuration: {
        type: Sequelize.STRING
      },
      endLocation: {
        type: Sequelize.STRING
      },
      endTime: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      days: {
        type: Sequelize.STRING
      },
      favoriteCount: {
        type: Sequelize.TEXT
      },
      tourComponents: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tours');
  }
};
