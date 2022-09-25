const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

dotenv.config({ path: "./config.env" });

/**
 *
 */
const protectSession = catchAsync(async (req, res, next) => {
  // Get token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token
    // req.headers.authorization = 'Bearer token'
    token = req.headers.authorization.split(" ")[1]; // -> [Bearer, token]
  }

  // Check if the token was sent or not
  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Invalid session",
    });
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Verify the token's owner
  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  });

  if (!user) {
    return res.status(403).json({
      status: "error",
      message: "The owner of the session is no longer active",
    });
  }

  // Grant access
  req.sessionUser = user;
  next();
});

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Check the sessionUser to compare to the one that wants to be updated/deleted
const protectUsersAccount = (req, res, next) => {
  const { sessionUser, user } = req;
  //const { id } = req.params;

  // If the users (ids) don't match, send an error, otherwise continue
  if (sessionUser.id !== user.id) {
    return res.status(403).json({
      status: "error",
      message: "You are not the owner of this account.",
    });
  }

  // If the ids match, grant access
  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Create middleware to protect restaurant, only owners should be able to update/delete
const protectRestaurantsOwners = (req, res, next) => {
  const { sessionUser, restaurant } = req;

  if (sessionUser.id !== restaurant.id) {
    return res.status(403).json({
      status: "error",
      message: "This restaurant does not belong to you.",
    });
  }

  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Create middleware to protect reviews, only owners should be able to update/delete
const protectReviewsOwners = (req, res, next) => {
  const { sessionUser, review } = req;

  if (sessionUser.id !== review.userId) {
    return res.status(403).json({
      status: "error",
      message: "This review does not belong to you.",
    });
  }

  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Create middleware to protect meals, only owners should be able to update/delete
const protectMealsOwners = (req, res, next) => {
  const { sessionUser, meal } = req;

  if (sessionUser.id !== meal.id) {
    return res.status(403).json({
      status: "error",
      message: "This meal does not belong to you.",
    });
  }

  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Create middleware to protect orders, only owners should be able to update/delete
const protectOrdersOwners = (req, res, next) => {
  const { sessionUser, order } = req;

  if (sessionUser.id !== order.id) {
    return res.status(403).json({
      status: "error",
      message: "This order does not belong to you.",
    });
  }

  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
// Create middleware that only grants access to admin users
const protectAdmin = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "You do not have the access level for this data.",
    });
  }

  next();
};

//
module.exports = {
  protectSession,
  protectUsersAccount,
  protectRestaurantsOwners,
  protectReviewsOwners,
  protectMealsOwners,
  protectOrdersOwners,
  protectAdmin,
};
