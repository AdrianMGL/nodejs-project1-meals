const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Order } = require("../models/order.model");
//const { Comment } = require("../models/comment.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { Restaurant } = require("../models/restaurant.model");
const { Meal } = require("../models/meal.model");

dotenv.config({ path: "./config.env" });

/**
 *
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { sessionUser } = req;

  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { status: "active", id: sessionUser.id },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

/**
 *
 */
const getAllUserOrders = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const orders = await Order.findAll({
    where: { userId: id },
    include: [
      { model: Meal, status: "active", include: { model: Restaurant } },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

/**
 *
 */
const getOrderByID = catchAsync(async (req, res, next) => {
  const { idUser } = req.sessionUser;
  const { id } = req.params;

  const orders = await Order.findOne({
    where: { id: idUser, id, status: "active" },
    include: [
      { model: Meal, status: "active", include: { model: Restaurant } },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

/**
 *
 */
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== "admin" && role !== "normal") {
    return res.status(400).json({
      status: "error",
      message: "Invalid role",
    });
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

/**
 *
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  // Method 2: Update using a model's instance
  await user.update({ name, email });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**
 *
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  // Method 3: Soft delete
  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

/**
 *
 */
const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

//
module.exports = {
  getAllUsers,
  getAllUserOrders,
  getOrderByID,
  createUser,
  updateUser,
  deleteUser,
  login,
};
