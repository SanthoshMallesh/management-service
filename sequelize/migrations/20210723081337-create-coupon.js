'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('coupon', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      consumerId: {
        type: Sequelize.STRING,
      },
      consumerIncentiveId: {
        type: Sequelize.STRING,
      },
      incentiveId: {
        type: Sequelize.INTEGER,
      },
      channelId: {
        type: Sequelize.INTEGER,
      },
      mktngPgmNbr: {
        type: Sequelize.INTEGER,
      },
      availedOn: {
        type: Sequelize.DATE,
      },
      redeemedOn: {
        type: Sequelize.DATE,
      },
      distributionType: {
        type: Sequelize.STRING,
      },
      retailer: {
        type: Sequelize.STRING,
      },
      incentiveValue: {
        type: Sequelize.FLOAT,
      },
      incentiveValueType: {
        type: Sequelize.STRING,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('coupon');
  },
};
