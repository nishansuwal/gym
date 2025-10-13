const Testimonial = require("../models/testimonial_schema");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");

const createTestimonial = async (req, res) => {
  try {
    const { name, salonId, designation, description } = req.body;
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 Request file:", req.file);

    const testimonial = new Testimonial({
      name,
      slug: slugify(name, { lower: true }),
      description,
      salonId,
      designation,
      featureImage: req.file ? req.file.filename : "",
    });

    await testimonial.save();
    res
      .status(200)
      .json({ message: "Testimonial has been created successfully" });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(400).json({ error: "Failed to create testimonial" });
  }
};

const getAllTestimonial = async (req, res) => {
  try {
    const { salonId } = req.params;
    const allTestimonial = await Testimonial.find({ salonId });
    res.status(200).json(allTestimonial);
  } catch (error) {
    console.log(error);
  }
};

const editTestimonial = async (req, res) => {
  const { testimonialId } = req.params;
  try {
    const testimonial = await Testimonial.findOne({ _id: testimonialId });
    res.status(200).json(testimonial);
  } catch (error) {
    console.error(error);
  }
};

const updateTestimonial = async (req, res) => {
  const { testimonialId } = req.params;

  try {
    const updateFields = {
      name: req.body.name,
      slug: slugify(req.body.name, {
        lower: true,
      }),
      description: req.body.description,
      designation: req.body.designation,
    };

    if (req.file) {
      const testimonial = await Testimonial.findById(testimonialId);
      if (testimonial) {
        const filePath = path.join(
          __dirname,
          "../../uploads/testimonial",
          testimonial.featureImage
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
          updateFields.featureImage = req.file.filename;
        }
        updateFields.featureImage = req.file.filename;
      }
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      { _id: testimonialId },
      { $set: updateFields }
    );

    if (updatedTestimonial) {
      return res
        .status(200)
        .json({ message: "Testimonial updated successfully" });
    } else {
      return res.status(404).json({ message: "Testimonial not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the Testimonial" });
  }
};

const testimonialdelete = async (req, res) => {
  const { testimonialId } = req.params;
  try {
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, error: "Testimonial not found" });
    }

    const fileName = testimonial.featureImage;
    if (fileName) {
      const filePath = path.join(
        __dirname,
        "../../uploads/testimonial",
        fileName
      );

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await Testimonial.findByIdAndDelete(testimonialId);
    return res.status(200).json({
      success: true,
      message: "Testimonial and associated image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllClientTestimonial = async (req, res) => {
  const { salonId } = req.params;
  try {
    const allTestimonial = await Testimonial.find({ salonId: salonId });
    res.status(200).json(allTestimonial);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error", error });
  }
};

const getAllAdminTest = async (req, res) => {
  try {
    const allTestimonial = await Testimonial.find();
    return res.status(200).json(allTestimonial);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonial,
  editTestimonial,
  updateTestimonial,
  testimonialdelete,
  getAllClientTestimonial,
  getAllAdminTest,
};
