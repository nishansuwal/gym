const Faq = require("../models/faq_schema");

// ✅ Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const { productId, question, answer } = req.body;

    if (!productId || !question) {
      return res.status(400).json({
        success: false,
        message: "Product ID and question are required",
      });
    }

    const faq = await Faq.create({ productId, question, answer });

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all FAQs (optionally by product)
exports.getAllFaqs = async (req, res) => {
  try {
    const { productId, includeTrash = false } = req.query;
    const query = {};

    if (productId) query.productId = productId;
    if (!includeTrash) query.trashbin = false;

    const faqs = await Faq.find(query)
      .sort({ createdAt: -1 })
      .populate("productId");

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};

// ✅ Get single FAQ by ID
exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).populate("productId");
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: error.message,
    });
  }
};

// ✅ Update FAQ (question/answer)
exports.updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;

    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
      error: error.message,
    });
  }
};

// ✅ Soft delete FAQ (move to trash)
exports.softDeleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.trashbin = true;
    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ moved to trash",
    });
  } catch (error) {
    console.error("Error soft-deleting FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to move FAQ to trash",
      error: error.message,
    });
  }
};

// ✅ Restore FAQ from trash
exports.restoreFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.trashbin = false;
    await faq.save();

    res.status(200).json({
      success: true,
      message: "FAQ restored successfully",
    });
  } catch (error) {
    console.error("Error restoring FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore FAQ",
      error: error.message,
    });
  }
};

// ✅ Permanently delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
      error: error.message,
    });
  }
};
