const express = require("express");

// Controllers
const {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders.controller");

// Middlewares
const { orderExists } = require("../middlewares/orders.middlewares");
const {
  protectSession,
  protectOrdersOwners,
} = require("../middlewares/auth.middlewares");

/** */
const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.get("/me", getAllOrders);

ordersRouter.post("/", createOrder);

ordersRouter.patch("/:id", orderExists, updateOrder);

ordersRouter.delete("/:id", orderExists, deleteOrder);

//
module.exports = { ordersRouter };
