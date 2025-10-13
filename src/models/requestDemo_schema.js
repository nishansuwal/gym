const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    employeNum: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    websiteURL: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    trashbin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RequestDemo = mongoose.model("requestDemo", requestSchema);

module.exports = RequestDemo;
