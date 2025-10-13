const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: Number,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    postalcode: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("address", addressSchema);

module.exports = Address;
