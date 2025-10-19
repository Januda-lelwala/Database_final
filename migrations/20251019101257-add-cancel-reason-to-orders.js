'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add cancel_reason column to orders table
    await queryInterface.addColumn('orders', 'cancel_reason', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove cancel_reason column from orders table
    await queryInterface.removeColumn('orders', 'cancel_reason');
  }
};
