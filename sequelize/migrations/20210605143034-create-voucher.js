'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('voucher', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      incentiveId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'incentive',
          key: 'id',
        },
      },
      minPurchasePrice: {
        type: Sequelize.INTEGER,
      },
      fixedExpiryValue: {
        type: Sequelize.DATE,
      },
      fileDistributionQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      fileUrl: {
        type: Sequelize.STRING(500),
      },
      voucherImage: {
        type: Sequelize.STRING(500),
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
    return queryInterface.dropTable('voucher');
  },
};
