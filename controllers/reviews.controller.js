// Models
const { Review } = require("../models/review.model");
const { User } = require("../models/user.model");
// const { Post } = require('../models/post.model');

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

/**
 *
 */
const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.findAll();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

/**
 *
 */
const createReview = catchAsync(async (req, res, next) => {
  const { comment, restaurantId, rating } = req.body;
  const { sessionUser } = req;

  const newReview = await Review.create({
    comment,
    userId: sessionUser.id,
    restaurantId,
    rating,
  });

  res.status(201).json({
    status: "success",
    data: { newReview },
  });
});

/**
 *
 */
const updateReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { review } = req;

  await review.update({ comment, rating });

  res.status(200).json({
    status: "success",
    data: { review },
  });
});

//
module.exports = {
  getAllReviews,
  createReview,
  updateReview,
};
