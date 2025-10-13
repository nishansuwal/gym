const express = require("express");
const authenticateAdmin = require("../middlewares/admin_auth");
const {
  createBlog,
  getAllBlog,
  getBlog,
  getBlogById,
  updateBlogById,
  deleteBlogById,
} = require("../controllers/blogs_controller");
const blogUpload = require("../helper/blog_fileHelper");
const router = express.Router();

router.post("/add", authenticateAdmin, blogUpload.single("image"), createBlog);
router.get("/get-all", getAllBlog);
router.get("/get", getBlog);
router.delete("/delete/:id", deleteBlogById);

router.post(
  "/update/:id",
  authenticateAdmin,
  blogUpload.single("image"),
  updateBlogById
);

module.exports = router;