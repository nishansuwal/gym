const Review = require("../models/review_schema");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const createReview = async (req, res) => {
  try {
    const { description, salonId, rating } = req.body;
    if (!rating || !description || !salonId) {
      return res
        .status(400)
        .json({ error: "Please provide all the required fields" });
    }
    const filesArray = req.files.map((element) => ({
      fileName: element.filename,
      filePath: element.path,
      fileType: element.mimetype,
    }));
    const reviewDetails = new Review({
      userId: req.user?._id,
      salonId: salonId,
      reviewDescription: description,
      rating: rating,
      images: filesArray,
    });

    const isSaved = await reviewDetails.save();

    res.status(200).json({
      isSaved,
      message: "Your review has been posted successfully. Thank you!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchReview = async (req, res) => {
  const { salonId } = req.params;
  try {
    const salonProductsReview = await Review.find({ salonId })
    .populate("userId")
    res.status(200).json(salonProductsReview);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetch review" });
};
}

const sallonReviewDelete = async (req, res) => {
  const { sallonReviewId } = req.params;

  try {
    const review = await Review.findById(sallonReviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    for (const image of review.images) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/review/",
        image.fileName
      );
      if (fs.existsSync(imagePath)) {
        await unlinkAsync(imagePath);
      }
    }
    await Review.findByIdAndDelete(sallonReviewId);
    return res
      .status(200)
      .json({ message: "Salon Review deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createReview,
  fetchReview,
  sallonReviewDelete,
};
