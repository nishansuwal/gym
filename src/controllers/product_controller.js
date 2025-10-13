const Product = require("../models/product_schema"); // Import your Product model
const ProductGallery = require("../models/productGallery_schema");
const deleteFile = require("../helper/deleteFileHelper");
const slugify = require("slugify"); // Import slugify if not already imported

const calculateSellingPrice = (markedPrice, discount) => {
  if (!markedPrice) return 0;
  if (!discount) return markedPrice;
  return markedPrice - (discount / 100) * markedPrice;
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const product = new Product({
      ...productData,
      slug: slugify(productData.name, { lower: true }),
      sellingPrice: calculateSellingPrice(
        productData.markedPrice,
        productData.discount
      ),
      image: req.file ? req.file.filename : "",
    });
    await product.save();
    res.status(200).json({ message: "Product has been created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Failed to create product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categorieId", "name");
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
  }
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const fields = [
      "name",
      "discount",
      "markedPrice",
      "specifications",
      "description",
      "stockQty",
      "brand",
      "sku",
      "status",
      "categorieId",
      "metaTitle",
      "metaDescription",
      "metaKeyword",
      "schema",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.name) {
      product.slug = slugify(req.body.name, { lower: true });
    }

    const markedPrice = req.body.markedPrice ?? product.markedPrice;
    const discount = req.body.discount ?? product.discount;

    if (markedPrice && discount !== undefined) {
      product.sellingPrice = markedPrice - (discount / 100) * markedPrice;
    }

    if (req.file) {
      deleteFile("product", product.image);
      product.image = req.file.filename;
    }

    await product.save();
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.image) {
      deleteFile("product", product.image);
    }
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

//product gallery controllers

const createMultipleImages = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ error: "Please upload at least one image" });
    }

    const galleryImages = req.files.map((file) => ({
      productId,
      image: file.filename,
    }));

    await ProductGallery.insertMany(galleryImages);

    return res
      .status(201)
      .json({ message: "Images uploaded successfully", images: galleryImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ error: "Failed to upload images" });
  }
};

const getProductGallery = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ProductGallery.find({ productId });
    return res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching product gallery:", error);
    return res.status(500).json({ error: "Failed to fetch product images" });
  }
};

const deleteSingleImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ProductGallery.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    if (image.image) {
      deleteFile("productGallery", image.image);
    }

    await ProductGallery.findByIdAndDelete(imageId);

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
};

const deleteAllProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await ProductGallery.find({ productId });
    console.log(images);

    if (!images || images.length === 0) {
      return res
        .status(404)
        .json({ error: "No images found for this product" });
    }

    for (const img of images) {
      if (img.image) deleteFile("productGallery", img.image);
    }

    await ProductGallery.deleteMany({ productId });

    return res
      .status(200)
      .json({ message: "All product images deleted successfully" });
  } catch (error) {
    console.error("Error deleting all images:", error);
    return res.status(500).json({ error: "Failed to delete all images" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,

  createMultipleImages,
  getProductGallery,
  deleteSingleImage,
  deleteAllProductImages,
};
