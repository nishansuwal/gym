const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../../models/user_schema");

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Old password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
});

module.exports = { changePassword };
