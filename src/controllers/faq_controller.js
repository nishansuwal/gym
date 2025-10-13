const Faq = require("../models/faq_schema");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");

const createFaq = async (req, res) => {
  try {
    const { vendorId, salonId, question, answer } = req.body;
    const faq = new Faq({
      vendorId,
      salonId,
      question,
      answer,
    });
    await faq.save();
    res.status(200).json({ message: "Faq has been created successfully" });
  } catch (error) {
    console.error("Error creating Faq:", error);
    res.status(400).json({ error: "Failed to create Faq" });
  }
};

const getAllVendorFaq = async (req, res) => {
  try {
    const { salonId } = req.params;
    const faq = await Faq.find({ salonId });
    res.status(200).json(faq);
  } catch (error) {
    console.log(error);
  }
};

// const editTestimonial = async (req, res) => {
//   const { testimonialId } = req.params;
//   try {
//     const testimonial = await Testimonial.findOne({ _id: testimonialId });
//     res.status(200).json(testimonial);
//   } catch (error) {
//     console.error(error);
//   }
// };

const updateFaq = async (req, res) => {
  const { faqId } = req.params;

  try {
    const updateFields = {
      question: req.body.question,
      answer: req.body.answer,
    };

    const updatedFaq = await Faq.findByIdAndUpdate(
      { _id: faqId },
      { $set: updateFields }
    );

    if (updatedFaq) {
      return res.status(200).json({ message: "Faq updated successfully" });
    } else {
      return res.status(404).json({ message: "Faq not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the Testimonial" });
  }
};

const faqdelete = async (req, res) => {
  const { faqId } = req.params;
  try {
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(404).json({ success: false, error: "Faq not found" });
    }
    await Faq.findByIdAndDelete(faqId);
    return res.status(200).json({
      success: true,
      message: "Faq deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// const getAllClientTestimonial = async (req, res) => {
//   const { salonId } = req.params;
//   try {
//     const allTestimonial = await Testimonial.find({ salonId: salonId });
//     res.status(200).json(allTestimonial);
//   } catch (error) {
//     console.error(error);
//      return res.status(500).json({error:'Internal error',error})
//   }
// };

// const getAllAdminTest = async (req, res) => {
//   try {
//     const allTestimonial = await Testimonial.find();
//     return res.status(200).json(allTestimonial);
//   } catch (error) {
//     console.error(error);
//   }
// };

module.exports = {
  createFaq,
  getAllVendorFaq,
  //   editTestimonial,
  updateFaq,
  faqdelete,
  //   getAllClientTestimonial,
  //   getAllAdminTest,
};
