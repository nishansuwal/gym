const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getAllCoupon,
  getValidCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/coupon_controller");

const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


// Admin routes
router.post("/", authenticateUser, authorizeAdmin, createCoupon);
router.get("/", authenticateUser, authorizeAdmin, getAllCoupon);
router.get("/valid", authenticateUser, authorizeAdmin, getValidCoupons);
router.get("/:id", authenticateUser, authorizeAdmin, getCouponById);
router.put("/:id", authenticateUser, authorizeAdmin, updateCoupon);
router.delete("/:id", authenticateUser, authorizeAdmin, deleteCoupon);

// Public route (checkout)
router.post("/validate", authenticateUser, validateCoupon);

module.exports = router;
