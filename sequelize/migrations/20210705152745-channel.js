'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('channel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'country',
          key: 'id',
        },
      },
      mktngPgmId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'marketing_program',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.TEXT,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        type: Sequelize.STRING,
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedBy: {
        type: Sequelize.STRING,
      },
      updatedDate: {
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channel');
  },
};
