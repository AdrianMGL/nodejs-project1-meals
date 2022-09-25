// Models
const { Restaurant } = require("../models/restaurant.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

/**
 *
 */
const restaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({ where: { id } });

  if (!restaurant) {
    return next(new AppError("Restaurant does not exists", 404));
  }

  req.restaurant = restaurant;
  next();
});

//
module.exports = { restaurantExists };
