const User = require("../../models/user_schema");
const asyncHandler = require("express-async-handler");
const deleteFile = require("../../helper/deleteFileHelper");

const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const getUser = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password");
  res.status(200).json({ user });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (fullName) user.fullName = fullName;
  if (email) {
    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (emailExists) {
      return res.status(400).json({ error: "Email already in use" });
    }
    user.email = email;
  }

  if (req.file) {
    deleteFile("user", user.picture);
    user.picture = req.file.filename;
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user.picture) {
    deleteFile("user", product.picture);
  }
  await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = { getUser, deleteUser, updateUser, getUserProfile };
