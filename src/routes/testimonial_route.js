const express = require("express");
const TestimonialUpload = require("../helper/testimonial_fileHelper");
const {
  createTestimonial,
} = require("../controllers/testimonial_controller");
// const authenticateUser = require("../middlewares/user_auth");
// const authenticateAdmin = require("../middlewares/admin_auth");
const router = express.Router();

router.post(
  "/create",
  TestimonialUpload.single("featureImage"),
  createTestimonial
);
// router.get("/list/:salonId", getAllTestimonial);
// router.get("/edit/:testimonialId", editTestimonial);
// router.post(
//   "/update/:testimonialId",
//   authenticateAdmin,
//   TestimonialUpload.single("featureImage"),
//   updateTestimonial
// );
// router.delete(
//   "/delete/:testimonialId",
//   authenticateAdmin,
//   testimonialdelete
// );

// router.get("/get-all/:salonId", getAllClientTestimonial);
// router.get("/get-admin", getAllAdminTest)


module.exports = router;