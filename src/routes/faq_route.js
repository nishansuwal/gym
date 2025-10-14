const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq_controller");
const authenticateUser = require("../middlewares/user_auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.post("/", authenticateUser, authorizeAdmin, faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/:id", faqController.getFaqById);
router.put("/:id", authenticateUser, authorizeAdmin, faqController.updateFaq);
router.patch(
  "/:id/trash",
  authenticateUser,
  authorizeAdmin,
  faqController.softDeleteFaq
);
router.patch(
  "/:id/restore",
  authenticateUser,
  authorizeAdmin,
  faqController.restoreFaq
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  faqController.deleteFaq
);

module.exports = router;
