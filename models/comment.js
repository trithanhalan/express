"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Comment = sequelize.define(
  "Comment",
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // This should match the table name for users
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts", // This should match the table name for posts
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    tableName: "Comments",
    sequelize, // This is the connection instance
    modelName: "Comment",
    timestamps: true, // Enable Sequelize to manage createdAt and updatedAt
  },
);

Comment.associate = function (models) {
  // Associations can be defined here
  Comment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  Comment.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
};

module.exports = Comment;
