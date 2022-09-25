const express = require("express");

// Controllers
const {
  getAllRestaurants,
  getRestaurantsByID,
  createRestaurant,
  createReviewRestaurantId,
  updateRestaurant,
  updateReviewRestaurant,
  deleteRestaurant,
  updateReview,
  deleteReviewRestaurant,
} = require("../controllers/restaurants.controller");

// Middlewares
const { restaurantExists } = require("../middlewares/restaurants.middlewares");
const { reviewExists } = require("../middlewares/reviews.middlewares");
const {
  protectAdmin,
  protectSession,
  protectRestaurantsOwners,
  protectReviewsOwners,
} = require("../middlewares/auth.middlewares");
const {
  createRestaurantValidators,
  createReviewValidators,
} = require("../middlewares/validators.middlewares");

/** */
const restaurantsRouter = express.Router();

restaurantsRouter.get("/", getAllRestaurants);

restaurantsRouter.get("/:id", getRestaurantsByID);

restaurantsRouter.use(protectSession);

restaurantsRouter.post("/", createRestaurantValidators, createRestaurant);

restaurantsRouter.patch(
  "/:id",
  protectAdmin,
  restaurantExists,
  updateRestaurant
);

restaurantsRouter.delete(
  "/:id",
  protectAdmin,
  restaurantExists,
  deleteRestaurant
);

restaurantsRouter.post(
  "/reviews/:restaurantId",
  createReviewValidators,
  createReviewRestaurantId
);

restaurantsRouter.patch(
  "/reviews/:id",
  reviewExists,
  protectReviewsOwners,
  updateReviewRestaurant
);

restaurantsRouter.delete(
  "/reviews/:id",
  reviewExists,
  protectReviewsOwners,
  deleteReviewRestaurant
);

//
module.exports = { restaurantsRouter };
