const bcrypt = require("bcryptjs");

module.exports = {
   
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync("welcome", 10);
    const users = [
      {
        username: "user1",
        passwordHash,
      },
      {
        username: "user2",
        passwordHash,
      },
      {
        username: "user3",
        passwordHash,
      },
      {
        username: "user4",
        passwordHash,
      },
      {
        username: "user5",
        passwordHash,
      },
    ];

    return queryInterface.bulkInsert("Users", users, {});
  },
   
  async down(queryInterface, Sequelize) {
    //
    // This will clear all entries from the users table
    return queryInterface.bulkDelete("Users", null, {});
  },
};
