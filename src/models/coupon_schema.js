const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 3,
    },
    discount: {
      type: Number,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage", 
    },
    status: {
      type: String,
      enum: ["draft", "published","expired"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("coupon", couponSchema);

module.exports = Coupon;
