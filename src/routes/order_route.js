const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  softDeleteOrder,
  restoreOrder,
  
} = require("../controllers/order_controller");

const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getAllOrders);
router.get("/:id", authenticateUser, getOrderById);

router.put("/:id/status", authenticateUser, authorizeAdmin, updateOrderStatus);

// router.put("/:id/cancel", authenticateUser, cancelOrder);

router.delete("/:id", authenticateUser, softDeleteOrder);
router.get("/restore-order/:id", authenticateUser, authorizeAdmin, restoreOrder);

module.exports = router;
