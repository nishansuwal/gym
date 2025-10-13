const Categorie = require("../models/categorie_schema");
const deleteFile = require("../helper/deleteFileHelper");
const slugify = require("slugify");

const addCategorie = async (req, res) => {
  try {
    const { name, parentCategory, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Title is required" });
    }

    const slug = slugify(name, { lower: true });

    const existing = await Categorie.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Categorie({
      name,
      slug,
      parentCategory: parentCategory || null,
      description,
      image: req.file ? req.file.filename : "",
      status: status ?? true,
    });

    await newCategory.save();

    return res.status(200).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
};

const fetchCategorieList = async (req, res) => {
  try {
    const categories = await Categorie.find().populate(
      "parentCategory",
      "name"
    );
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};

const getMainCategories = async (req, res) => {
  try {
    const categories = await Categorie.find({ parentCategory: null });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching main categories:", error);
    res.status(500).json({ message: "Failed to fetch main categories" });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    const subcategories = await Categorie.find({ parentCategory: parentId });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};

const updateCategorie = async (req, res) => {
  const { categorieId } = req.params;

  try {
    const category = await Categorie.findById(categorieId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name, { lower: true });
    }

    if (req.body.parentCategory)
      category.parentCategory = req.body.parentCategory;
    if (req.body.description) category.description = req.body.description;
    if (req.body.status !== undefined) category.status = req.body.status;

    if (req.file) {
      deleteFile("categorie", category.image);
      category.image = req.file.filename;
    }

    await category.save();
    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ error: "Failed to update category" });
  }
};

const categoriedelete = async (req, res) => {
  const { categorieId } = req.params;
  try {
    const category = await Categorie.findById(categorieId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    deleteFile("categorie", category.image);

    await Categorie.findByIdAndDelete(categorieId);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ error: "Failed to delete category" });
  }
};

module.exports = {
  addCategorie,
  fetchCategorieList,
  getSubCategories,
  getMainCategories,
  updateCategorie,
  categoriedelete,
};
