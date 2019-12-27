'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Components', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      RestaurantId: {
        type: Sequelize.INTEGER
      },
      AttractionId: {
        type: Sequelize.INTEGER
      },
      ShopId: {
        type: Sequelize.INTEGER
      },
      Lat: {
        type: Sequelize.STRING
      },
      Lng: {
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
    return queryInterface.dropTable('Components');
  }
};
