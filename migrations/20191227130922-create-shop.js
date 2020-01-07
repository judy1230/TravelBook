'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Shops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      opening_up: {
        type: Sequelize.INTEGER
      },
      opening_down: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      viewCounts: {
        type: Sequelize.STRING
      },
      stayTime: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.STRING
      },
      Location: {
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
    return queryInterface.dropTable('Shops');
  }
};
