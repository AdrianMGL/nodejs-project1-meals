const express = require("express");

// Controllers
const {
  getAllMeals,
  getMealsByID,
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meals.controller");

// Middlewares
const { mealExists } = require("../middlewares/meals.middlewares");
const {
  protectSession,
  protectMealsOwners,
  protectAdmin,
} = require("../middlewares/auth.middlewares");
const {
  createMealValidators,
} = require("../middlewares/validators.middlewares");

/** */
const mealsRouter = express.Router();

mealsRouter.get("/", getAllMeals);

mealsRouter.get("/:id", getMealsByID);

mealsRouter.use(protectSession);

mealsRouter.post("/:id", createMealValidators, createMeal);

mealsRouter.patch("/:id", protectAdmin, mealExists, updateMeal);

mealsRouter.delete("/:id", protectAdmin, mealExists, deleteMeal);

//
module.exports = { mealsRouter };
