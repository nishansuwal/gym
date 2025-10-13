const express = require("express");
const {
  createFaq,
  getAllVendorFaq,
  updateFaq,
  faqdelete,
} = require("../controllers/faq_controller");
const authenticateAdmin = require("../middlewares/admin_auth");
const router = express.Router();

router.post("/create", authenticateAdmin, createFaq);
router.get("/list/:salonId", getAllVendorFaq);
router.post("/update/:faqId", authenticateAdmin, updateFaq);
router.delete("/delete/:faqId", authenticateAdmin, faqdelete);

module.exports = router;
