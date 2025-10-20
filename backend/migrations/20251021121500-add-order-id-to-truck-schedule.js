"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("truck_schedule");
    if (!table.order_id) {
      await queryInterface.addColumn("truck_schedule", "order_id", {
        type: Sequelize.STRING(40),
        allowNull: true,
        references: {
          model: "orders",
          key: "order_id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("truck_schedule");
    if (table.order_id) {
      await queryInterface.removeColumn("truck_schedule", "order_id");
    }
  }
};

