'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('app_config', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      module: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      moduleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      configName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      configValue: {
        type: Sequelize.STRING,
      },
      configOptions: {
        type: Sequelize.JSON,
      },
      createdBy: {
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('app_config');
  },
};
