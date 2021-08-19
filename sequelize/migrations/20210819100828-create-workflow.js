'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('workFlow', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isCampaignFlow: {
        type: Sequelize.BOOLEAN,
      },
      isIncentiveFlow: {
        type: Sequelize.BOOLEAN,
      },
      isRequesterAction: {
        type: Sequelize.BOOLEAN,
      },
      isApproverAction: {
        type: Sequelize.BOOLEAN,
      },
      isWebStatus: {
        type: Sequelize.BOOLEAN,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('workFlow');
  },
};
