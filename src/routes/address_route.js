const express = require("express");
const {
  upsertAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAllAddressesForAdmin,
} = require("../controllers/address_controller");

const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

// 🧍 User routes
router.post("/", authenticateUser, upsertAddress);
router.get("/", authenticateUser, getMyAddresses);
router.get("/:addressId", authenticateUser, getAddressById);
router.put("/:addressId", authenticateUser, updateAddress);
router.delete("/:addressId", authenticateUser, deleteAddress);

// 🧑‍💼 Admin routes
router.get(
  "/admin/all",
  authenticateUser,
  authorizeAdmin,
  getAllAddressesForAdmin
);

module.exports = router;
