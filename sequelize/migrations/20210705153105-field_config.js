'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('field_config', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mpId: {
        type: Sequelize.INTEGER,
      },
      area: {
        type: Sequelize.STRING,
      },
      field: {
        type: Sequelize.STRING,
      },
      properties: {
        type: Sequelize.JSON,
      },
      multiLocale: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    return queryInterface.dropTable('field_config');
  },
};
