const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} = require("../controllers/review_controller");

const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

router.post("/", authenticateUser, createReview);
router.get("/", getAllReviews);
router.get("/:productId", getReviewsByProduct);
router.put("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
