const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const SECRET_KEY = "your_secret_key";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.passwordHash);
    if (passwordIsValid) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
      res.json({ message: "Authentication successful", token });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user.id != user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access this user data" });
    }
    res.status(200).json(user); 
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  getUserById,
};
