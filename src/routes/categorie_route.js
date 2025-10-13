const express = require("express");
// const authenticateAdmin = require("../middlewares/admin_auth");
const FileUploadHelper = require("../helper/fileUploadHelper");
const categorieUpload = new FileUploadHelper("uploads/categorie");

const {
  addCategorie,
  fetchCategorieList,
  categoriedelete,
  updateCategorie,
  getSubCategories,
  getMainCategories,
} = require("../controllers/categorie_controller");

const router = express.Router();

router.post("/add", categorieUpload.upload.single("image"), addCategorie);
router.get("/list", fetchCategorieList);
router.get("/subcategories/:parentId", getSubCategories);
router.get("/maincategories", getMainCategories);

router.put(
  "/update/:categorieId",
  categorieUpload.upload.single("image"),
  updateCategorie
);

router.delete("/delete/:categorieId", categoriedelete);

module.exports = router;
