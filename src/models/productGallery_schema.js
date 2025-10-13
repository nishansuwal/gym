const mongoose = require("mongoose");

const productGallerySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },

    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const productgallerys = mongoose.model("product_gallery", productGallerySchema);

module.exports = productgallerys;
