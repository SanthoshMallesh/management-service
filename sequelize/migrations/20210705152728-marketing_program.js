'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('marketing_program', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mktngPgmNbr: {
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      mktngPgmName: {
        type: Sequelize.STRING,
      },
      mktngPgmDesc: {
        type: Sequelize.TEXT,
      },
      legalEntNbr: {
        type: Sequelize.INTEGER,
      },
      brandId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'brand',
          key: 'id',
        },
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'country',
          key: 'id',
        },
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
    return queryInterface.dropTable('marketing_program');
  },
};
