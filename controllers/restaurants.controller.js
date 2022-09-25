// Models
const { Restaurant } = require("../models/restaurant.model");
const { User } = require("../models/user.model");
const { Review } = require("../models/review.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

/**
 *
 */
const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: "success",
    data: { newRestaurant },
  });
});

/**
 *
 */
const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: "active" },
    include: { model: Review, required: false, where: { status: "active" } },
  });

  res.status(200).json({
    status: "success",
    data: { restaurants },
  });
});

/**
 *
 */
const getRestaurantsByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurants = await Restaurant.findOne({ where: { id } });

  res.status(200).json({
    status: "success",
    data: { restaurants },
  });
});

/**
 *
 */
const updateRestaurant = catchAsync(async (req, res, next) => {
  const { name, address } = req.body;
  const { restaurant } = req;

  await restaurant.update({ name, address });

  res.status(200).json({
    status: "success",
    data: { restaurant },
  });
});

/**
 *
 */
const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: "disabled" });

  res.status(200).json({
    status: "success",
  });
});

/**
 *
 */
const createReviewRestaurantId = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { sessionUser } = req;
  const { restaurantId } = req.params;

  const newReviewRestaurantId = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId,
    rating,
  });

  res.status(201).json({
    status: "success",
    data: { newReviewRestaurantId },
  });
});

/**
 *
 */
const updateReviewRestaurant = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(200).json({
    status: "success",
    data: { review },
  });
});

/**
 *
 */
const deleteReviewRestaurant = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

//
module.exports = {
  getAllRestaurants,
  getRestaurantsByID,
  createRestaurant,
  createReviewRestaurantId,
  updateRestaurant,
  updateReviewRestaurant,
  deleteRestaurant,
  deleteReviewRestaurant,
};
