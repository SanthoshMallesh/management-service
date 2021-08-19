'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('campaign', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      startDateTime: {
        type: Sequelize.DATE,
      },
      endDateTime: {
        type: Sequelize.DATE,
      },
      campaignType: {
        type: Sequelize.STRING,
      },
      budgetAmount: {
        type: Sequelize.FLOAT,
      },
      isValid: {
        type: Sequelize.BOOLEAN,
      },
      errorDescription: {
        type: Sequelize.JSON,
      },
      parentCampaignId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'campaign',
          key: 'id',
        },
      },
      requesterAction: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workFlow',
          key: 'id',
        },
      },
      approverAction: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workFlow',
          key: 'id',
        },
      },
      webStatus: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workFlow',
          key: 'id',
        },
      },
      workflowStatus: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workFlow',
          key: 'id',
        },
      },
      incentiveCount: {
        type: Sequelize.INTEGER,
      },
      timeZoneId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'time_zone',
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
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('campaign');
  },
};
