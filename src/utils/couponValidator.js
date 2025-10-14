const Coupon = require("../models/coupon_schema");

exports.validateAndApplyCoupon = async (code, totalAmount) => {
  if (!code || !totalAmount) {
    throw new Error("Coupon code and total amount are required.");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    status: "published",
  });
  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new Error("Coupon has expired or not yet valid.");
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (totalAmount * coupon.discount) / 100;
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.discount;
  }

  const finalAmount = Math.max(totalAmount - discountAmount, 0);

  return { discountAmount, finalAmount };
};
