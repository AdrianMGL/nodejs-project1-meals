// Models
const { User } = require("./user.model");
const { Order } = require("./order.model");
const { Meal } = require("./meal.model");
const { Restaurant } = require("./restaurant.model");
const { Review } = require("./review.model");

/**
 *
 */
const initModels = () => {
  // 1 User <----> M Order
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);

  // 1 Meals <----> 1 Order
  Meal.hasOne(Order, { foreignKey: "mealId" });
  Order.belongsTo(Meal);

  // 1 Restaurant <----> M Meal
  Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
  Meal.belongsTo(Restaurant);

  // 1 Restaurant <----> M Review
  Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
  Review.belongsTo(Restaurant);

  // 1 User <----> M Review
  User.hasMany(Review, { foreignKey: "userId" });
  Review.belongsTo(User);
};

//
module.exports = { initModels };
