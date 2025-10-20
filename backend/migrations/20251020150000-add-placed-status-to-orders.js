'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        "ALTER TABLE orders MODIFY COLUMN status ENUM('pending','confirmed','placed','scheduled','in_transit','delivered','cancelled') DEFAULT 'pending'",
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        "ALTER TABLE orders MODIFY COLUMN status ENUM('pending','confirmed','scheduled','in_transit','delivered','cancelled') DEFAULT 'pending'",
        { transaction }
      );
    });
  }
};

