const path = require("path");
const fs = require("fs");
const Coupon = require("../models/coupon_schema");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, discountType, validFrom, validUntil, status } =
    req.body;

  if (!code || !discount || !validFrom || !validUntil) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided." });
  }

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
    return res.status(400).json({ error: "Coupon code already exists." });
  }

  const coupon = await Coupon.create({
    code,
    discount,
    discountType,
    validFrom,
    validUntil,
    status,
  });

  res.status(201).json({
    message: "Coupon created successfully",
    data: coupon,
  });
});

const getAllCoupon = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json(coupons);
});

const getValidCoupons = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  const coupons = await Coupon.find({
    status: "published",
    validFrom: { $lte: currentDate },
    validUntil: { $gte: currentDate },
  }).sort({ createdAt: -1 });

  res.status(200).json(coupons);
});


const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found." });
  }
  res.status(200).json(coupon);
});


const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, discountType, validFrom, validUntil, status } = req.body;

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found." });
  }

  Object.assign(coupon, {
    code: code?.toUpperCase() || coupon.code,
    discount: discount ?? coupon.discount,
    discountType: discountType || coupon.discountType,
    validFrom: validFrom || coupon.validFrom,
    validUntil: validUntil || coupon.validUntil,
    status: status || coupon.status,
  });

  await coupon.save();
  res.status(200).json({ message: "Coupon updated successfully", data: coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found." });
  }

  await coupon.deleteOne();
  res.status(200).json({ message: "Coupon deleted successfully" });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, totalAmount } = req.body;
  if (!code || !totalAmount) {
    return res.status(400).json({ error: "Coupon code and total amount are required." });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), status: "published" });
  if (!coupon) {
    return res.status(404).json({ error: "Invalid coupon code." });
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return res.status(400).json({ error: "Coupon has expired or not yet valid." });
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (totalAmount * coupon.discount) / 100;
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.discount;
  }

  const finalAmount = Math.max(totalAmount - discountAmount, 0);

  res.status(200).json({
    message: "Coupon applied successfully",
    discountAmount,
    finalAmount,
  });
});

module.exports = {
  createCoupon,
  getAllCoupon,
  getValidCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
