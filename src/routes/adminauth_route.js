const express = require("express");
// const multer = require('multer');
// const activateAdmin = require('../controllers/admin/admin_activation_controller');
const { getAllVendors } = require("../controllers/admin/admin_controller");
const adminSignin = require("../controllers/admin/admin_signin_controller");
const {
  adminSignup,
  approveUser,
} = require("../controllers/admin/admin_signup_controller");
const authenticateAdmin = require("../middlewares/admin_auth");
// const authenticateVendor = require('../middlewares/vendor_auth')
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const router = express.Router();

router.get("/refersh", authenticateAdmin, (req, res) => {
  console.log("call for refressh token");
  return res.status(200).json({
    success: true,
  });
});

router.post("/signup", adminSignup);
router.get("/approve-user/:token", approveUser);
router.post("/signin", adminSignin);
// router.get("/check-admin-auth", authenticateAdmin, (req, res) => {
//   return res.json({ login: true });
// });
// router.get("/check-vendor-auth", authenticateVendor, (req, res) => {
//   console.log('route reached')
//   return res.json({ login: true });
// });
router.get("/get-all", authenticateAdmin, getAllVendors);
// router.delete("/delete/:id", deletevendor);

module.exports = router;
