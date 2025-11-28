const express = require("express");
const jwt = require("jsonwebtoken");
const {
  userSignUp,
  adminSignUp,
} = require("../controllers/user/user_signup_controller");
const userSignIn = require("../controllers/user/user_signin_controller");
const userActive = require("../controllers/user/user_activation_controller");
const forgotPassword = require("../controllers/user/forget_password_controller");
const resetPassword = require("../controllers/user/reset_password_controller");
const {
  changePassword,
} = require("../controllers/user/change_password_controller");

const authenticateUser = require("../middlewares/user_auth");
const { loginLimiter } = require("../utils/limiter");

const router = express.Router();
router.post("/user/signup", userSignUp);
router.post("/admin/signup", adminSignUp);

router.post("/user/signin", loginLimiter, userSignIn);
router.get("/activate-account/:token", userActive);

router.post("/forgot-password", forgotPassword.forgotPassword);
router.post("/reset-password/:token", resetPassword.resetPassword);
router.put("/change-password", authenticateUser, changePassword);

module.exports = router;
