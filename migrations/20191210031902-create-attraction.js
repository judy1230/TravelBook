'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Attractions', {
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
      opening_hours: {
        type: Sequelize.STRING
      },
      opening_up: {
        type: Sequelize.STRING
      },
      opening_down: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      Location: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Attractions');
  }
};
