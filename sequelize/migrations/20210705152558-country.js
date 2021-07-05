'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('country', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      localeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locale',
          key: 'id',
        },
      },
      primaryCurrencyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currency',
          key: 'id',
        },
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
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('country');
  },
};
