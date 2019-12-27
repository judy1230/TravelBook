'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
      },
      RestaurantId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      TourId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      BlogId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      AttractionId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      ShoppingId: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Comments');
  }
};
