'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('campaign', {
      id: {
        allowNull: false,
        autoIncerement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      updatedBy: {
        type: Sequelize.STRING,
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedDate: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('campaign');
  },
};
