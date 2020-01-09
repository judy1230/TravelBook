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
      startMinInit: {
        type: Sequelize.STRING
      },
      startHourInit: {
        type: Sequelize.STRING
      },
      origin: {
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
        type: Sequelize.STRING
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
