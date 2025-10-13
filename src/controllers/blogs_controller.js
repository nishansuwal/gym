const path = require("path");
const fs = require("fs");
const Blog = require("../models/blogs_schema");

const createBlog = async (req, res) => {
  try {
    const { title, description, serviceId } = req.body;
    let status = req.body.status;
    if (status === "") {
      status = "published";
    }
    const blog = new Blog({
      title,
      description,
      serviceId,
      status,
      image: req.file.filename,
    });
    await blog.save();
    res
      .status(200)
      .json({ success: true, message: "Blog has been saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all services
const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("serviceId");
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({status: "published"}).populate("serviceId");
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blog.findById(id);
    if (!blogs) {
      res.status(404).json({ success: false, error: "Blog not found" });
    } else {
      res.json({ success: true, data: blogs });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const updateFields = {
      title: req.body.title,
      description: req.body.description,
      serviceId: req.body.serviceId,
      status: req.body.status,
    };

    if (req.file) {
      const blogs = await Blog.findById(id);
      if (blogs) {
        const filePath = path.join(
          __dirname,
          "../../uploads/blog",
          blogs.image
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
        updateFields.image = req.file.filename;
      }
    }

    const updatedblogs = await Blog.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true } // Returns the updated document
    );

    if (updatedblogs) {
      return res.status(200).json({ message: "Blog updated successfully" });
    } else {
      return res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the Blog" });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blog.findById(id);
    if (!blogs) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    const fileName = blogs.image;
    if (fileName) {
      const filePath = path.join(__dirname, "../../uploads/blog", fileName);

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    await Blog.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Blog has been deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlog,
  getBlog,
  getBlogById,
  updateBlogById,
  deleteBlogById,
};
