'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('time_zone', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timeZoneName: {
        type: Sequelize.STRING,
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'country',
          key: 'id',
        },
      },
      gtmOffset: {
        type: Sequelize.STRING,
      },
      timeZone: {
        type: Sequelize.STRING,
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
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('time_zone');
  },
};
