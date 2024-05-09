const Sequelize = require("sequelize");
const config = require("./config/config.json").development; // Use 'production' or other environment as needed.

// Create a new Sequelize instance using configuration from your config.json file.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  },
);

module.exports = sequelize;
