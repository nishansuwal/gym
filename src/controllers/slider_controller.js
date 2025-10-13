const Slider = require("../models/slider_schema");
const crypto = require("crypto");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");
const addSlider = async (req, res) => {
  try {
    const { title, description, salonId } = req.body;
    const sliders = new Slider({
      title,
      slug: slugify(title, { lower: true }),
      salonId,
      description,
      featureImage: req.file ? req.file.filename : "",
    });
    await sliders.save();
    res
      .status(200)
      .json({ message: "Your sliders has been placed successfully" });
  } catch (error) {
    console.error(error);
  }
};

const fetchSlider = async (req, res) => {
  const { salonId } = req.params;
  try {
    const salonSlider = await Slider.find({ salonId });
    res.status(200).json(salonSlider);
  } catch (error) {
    console.error(error);
  }
};

const editSlider = async (req, res) => {
  const { sliderId } = req.params;
  try {
    const slider = await Slider.findOne({ _id: sliderId });
    res.status(200).json(slider);
  } catch (error) {
    console.error(error);
  }
};

const updateSlider = async (req, res) => {
  const { sliderId } = req.params;

  try {
    const updateFields = {
      title: req.body.title,
      slug: slugify(req.body.title, {
        lower: true,
      }),
      description: req.body.description,
    };

    if (req.file) {
      const slider = await Slider.findById(sliderId);
      if (slider) {
        const filePath = path.join(
          __dirname,
          "../../uploads/slider",
          slider.featureImage
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
        updateFields.featureImage = req.file.filename;
      }
    }

    const updatedSlider = await Slider.findByIdAndUpdate(
      { _id: sliderId },
      { $set: updateFields },
      { new: true } // Returns the updated document
    );

    if (updatedSlider) {
      return res.status(200).json({ message: "Slider updated successfully" });
    } else {
      return res.status(404).json({ message: "Slider not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the slider" });
  }
};

const sliderdelete = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const slider = await Slider.findById(sliderId);

    if (!slider) {
      return res
        .status(404)
        .json({ success: false, error: "Slider not found" });
    }

    const fileName = slider.featureImage;
    if (fileName) {
    const filePath = path.join(__dirname, "../../uploads/slider", fileName);

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

    await Slider.findByIdAndDelete(sliderId);
    res.status(200).json({
      success: true,
      message: "Slider has been deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addSlider,
  fetchSlider,
  editSlider,
  updateSlider,
  sliderdelete,
};
