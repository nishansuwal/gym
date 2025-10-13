const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    question: {
      type: String,
      required: false,
    },
    answer: {
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

const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;
