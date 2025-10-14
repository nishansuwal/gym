const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      trim: true,
      default: "",
    },
    trashbin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;
