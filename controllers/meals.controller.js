// Models
const { Meal } = require("../models/meal.model");
const { Restaurant } = require("../models/restaurant.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

/**
 *
 */
const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: "active" },
    include: [
      {
        model: Restaurant,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      meals,
    },
  });
});

/**
 *
 */
const getMealsByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meals = await Meal.findOne({
    where: { id, status: "active" },
    include: [
      {
        model: Restaurant,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: { meals },
  });
});

/**
 *
 */
const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { sessionUser } = req;
  const { id } = req.params;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: "success",
    data: { newMeal },
  });
});

/**
 *
 */
const updateMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { meal } = req;

  await meal.update({ name, price });

  res.status(200).json({
    status: "success",
    data: { meal },
  });
});

/**
 *
 */
const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: "disabled" });

  res.status(200).json({
    status: "success",
  });
});

//
module.exports = {
  getAllMeals,
  getMealsByID,
  createMeal,
  updateMeal,
  deleteMeal,
};
