"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Post = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // This is a reference to another model
        key: "id", // This is the column name of the referenced model
      },
    },
  },
  {
    tableName: "Posts",
    timestamps: true, 
  },
);

Post.associate = function (models) {
  // associations can be defined here
  Post.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user", // Optional: define an alias for when data is retrieved
  });
};

module.exports = Post;
