"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });

    await queryInterface.changeColumn("Users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });

    await queryInterface.changeColumn("Users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
  },
};
