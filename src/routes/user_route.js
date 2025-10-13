const express = require("express");
const {
  getUser,
  deleteUser,
  updateUser,
  getUserProfile,

} = require("../controllers/user/user_controller");

const router = express.Router();
const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const FileUploadHelper = require("../helper/fileUploadHelper");
const pictureUpload = new FileUploadHelper("uploads/user");

router.get("/", authenticateUser,authorizeAdmin, getUser);
router.get("/profile", authenticateUser,getUserProfile);
router.put("/profile",pictureUpload.upload.single("picture"), authenticateUser,updateUser);
router.delete("/:userId",authenticateUser,authorizeAdmin, deleteUser);
module.exports = router;
