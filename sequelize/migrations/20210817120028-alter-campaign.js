'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('campaign', 'budgetCode', {
        type: Sequelize.DataTypes.STRING,
      }),
      queryInterface.addColumn('campaign', 'consumerParticipationLimit', {
        type: Sequelize.DataTypes.INTEGER,
      }),
      queryInterface.addColumn('campaign', 'campaignParticipationLimit', {
        type: Sequelize.DataTypes.INTEGER,
      }),
      queryInterface.addColumn('campaign', 'campaignImage', {
        type: Sequelize.DataTypes.STRING,
      }),
      queryInterface.addColumn('campaign', 'isEdited', {
        type: Sequelize.DataTypes.BOOLEAN,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('campaign', 'budgetCode'),
      queryInterface.removeColumn('campaign', 'consumerParticipationLimit'),
      queryInterface.removeColumn('campaign', 'campaignParticipationLimit'),
      queryInterface.removeColumn('campaign', 'campaignImage'),
      queryInterface.removeColumn('campaign', 'isEdited'),
    ]);
  },
};
