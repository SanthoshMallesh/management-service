'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('campaign_channel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'campaign',
          key: 'id',
        },
      },
      channelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'channel',
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
    return queryInterface.dropTable('campaign_channel');
  },
};
