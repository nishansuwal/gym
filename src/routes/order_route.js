const express = require("express");
const {
  getOrder,
  placeOrder,
  getUserOrder,
  getOrdersDetails,
  orderdelete,
  orderEdit,
  getUserOrderClient,
  clientUpdateStatus,
  getUserOrderByadminId,
} = require("../controllers/order_controller");
const authenticateUser = require("../middlewares/user_auth");
const authenticateAdmin = require("../middlewares/admin_auth");
const router = express.Router();

router.post("/placeOrders", placeOrder);
router.get("/getUserOrders/:userId", getUserOrder);
router.get(
  "/client/getOrdersDetails/:userId",
  authenticateUser,
  getUserOrderClient
);
router.get("/getOrdersDetail/:orderId", authenticateAdmin, getOrdersDetails);
router.get("/getOrders", authenticateAdmin, getOrder);
router.delete("/orderdelete/:orderId", authenticateAdmin, orderdelete);
router.get("/statusEdit/:orderId", orderEdit);

router.put(
  "/clientUpdateStatus/:orderId",
  clientUpdateStatus
);

router.get(
  "/vendor/getOrders/:adminId",
  authenticateAdmin,
  getUserOrderByadminId
);


module.exports = router;
