const express = require("express");
const {
  createUserContact,
  getUserContact,
  deleteContact,
} = require("../controllers/contact_controller");
const authenticateUser = require("../middlewares/user_auth");
const authenticateAdmin = require("../middlewares/admin_auth");
const router = express.Router();

router.post("/create", authenticateUser, createUserContact);
router.get("/get", getUserContact);
// router.post("/update/:userId", updateOrderAddress);
router.delete("/delete/:id", authenticateAdmin, deleteContact);


module.exports = router;
