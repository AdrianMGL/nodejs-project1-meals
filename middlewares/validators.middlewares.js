const { body, validationResult } = require("express-validator");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);
    const message = errorMessages.join(". ");

    return res.status(400).json({
      status: "error",
      message,
    });
  }

  next();
};

//
const createUserValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Must provide a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  checkValidations,
];

//
const createRestaurantValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("address")
    .isString()
    .withMessage("Address must be a string")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 10 characters long"),
  body("rating")
    .isInt()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1 number long"),
  checkValidations,
];

//
const createMealValidators = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .isInt()
    .withMessage("Price must be a number")
    .isLength({ min: 1 })
    .withMessage("Price must be at least 1 number long"),
  checkValidations,
];

//
const createReviewValidators = [
  body("comment")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  body("rating")
    .isInt()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1 number long"),
  checkValidations,
];

//
const createOrderValidators = [
  body("quantity")
    .isInt()
    .withMessage("quantity must be a number")
    .isLength({ min: 1 })
    .withMessage("quantity must be at least 1 number long"),
  checkValidations,
];

//
module.exports = {
  createUserValidators,
  createRestaurantValidators,
  createMealValidators,
  createOrderValidators,
  createReviewValidators,
};
