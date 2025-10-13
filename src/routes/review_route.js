const express = require("express");
const authenticateAdmin = require("../middlewares/admin_auth");
const authenticateUser = require("../middlewares/user_auth");
const {
  createReview,
  fetchReview,
  sallonReviewDelete,
} = require("../controllers/review_controller");
const reviewUpload = require("../helper/review_fileHelper");
const router = express.Router();

router.post(
  "/addreview",
  authenticateUser,
  reviewUpload.array("images"),
  createReview
);
router.get("/list/:salonId", fetchReview);
router.delete("/delete/:sallonReviewId", sallonReviewDelete);

module.exports = router;
