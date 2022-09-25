// Models
const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");
const { Meal } = require("../models/meal.model");
const { Restaurant } = require("../models/restaurant.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

/**
 *
 */
const getAllOrders = catchAsync(async (req, res, next) => {
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
const createOrder = catchAsync(async (req, res, next) => {
  //
  const { mealId, quantity } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({ where: { id: mealId, status: "active" } });

  if (!meal) {
    return next(new AppError("Meal do not found", 404));
  }

  const totalPrice = quantity * meal.price;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(201).json({
    status: "success",
    data: { newOrder },
  });
});

/**
 *
 */
const updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ where: { id, status: "active" } });

  if (!order) {
    return next(new AppError("Order do not found", 404));
  }

  await order.update({ status: "completed" });

  res.status(200).json({
    status: "success",
    data: { order },
  });
});

/**
 *
 */
const deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ where: { id, status: "active" } });

  if (!order) {
    return next(new AppError("Order do not found", 404));
  }

  await order.update({ status: "cancelled" });

  res.status(200).json({
    status: "success",
  });
});

//
module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
