const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/user_schema");

// RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!token) return res.status(400).json({ error: "Missing token" });
  if (!newPassword || !confirmPassword)
    return res.status(400).json({ error: "Please enter all fields" });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });
  if (newPassword.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  // Find user by token & check expiry
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }, // token still valid
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Invalid or expired reset token" });
  }

  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
});
module.exports = {
  resetPassword,
};