const { min } = require("lodash");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    discount: {
      type: Number,
      required: false,
    },

    categorieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorie",
    },
    markedPrice: {
      type: Number,
      required: false,
    },
    specifications: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },

    stockQty: {
      type: Number,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    metaTitle: {
      type: String,
      // required: true,
    },
    metaDescription: {
      type: String,
      // required: true,
    },
    metaKeyword: {
      type: String,
      // required: true,
    },
    schema: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
