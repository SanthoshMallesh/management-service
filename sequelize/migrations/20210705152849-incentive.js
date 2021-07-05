'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('incentive', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      startDateTime: {
        type: Sequelize.DATE,
      },
      endDateTime: {
        type: Sequelize.DATE,
      },
      incentiveType: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'campaign',
          key: 'id',
        },
      },
      timeZoneId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'time_zone',
          key: 'id',
        },
      },
      workFlowStatus: {
        type: Sequelize.INTEGER,
      },
      distributionType: {
        type: Sequelize.STRING,
      },
      isValid: {
        type: Sequelize.BOOLEAN,
      },
      errorDescription: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable('incentive');
  },
};
