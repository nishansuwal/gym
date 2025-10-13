const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
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

    description: {
      type: String,
      required: false,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorie", // self-reference
      default: null,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], 
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Categorie = mongoose.model("categorie", categorieSchema);

module.exports = Categorie;
