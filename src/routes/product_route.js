const express = require("express");
const FileUploadHelper = require("../helper/fileUploadHelper");
const productUpload = new FileUploadHelper("uploads/product");
const productGalleryUpload = new FileUploadHelper("uploads/productGallery");

// const authenticateAdmin = require("../middlewares/admin_auth");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,

  createMultipleImages,
  getProductGallery,
  deleteSingleImage,
  deleteAllProductImages,
} = require("../controllers/product_controller");
const router = express.Router();

router.post("/", productUpload.upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.put("/:productId", productUpload.upload.single("image"), updateProduct);
router.delete("/:productId", deleteProduct);

router.post(
  "/gallery",
  productGalleryUpload.upload.array("image", 10),
  createMultipleImages
);
router.get("/gallery/:productId", getProductGallery);
router.delete("/gallery/delete/:imageId", deleteSingleImage);
router.delete("/gallery/deleteall/:productId", deleteAllProductImages);

module.exports = router;
