const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../../models/user_schema");
const sendEmail = require("../../helper/sendEmail"); // path based on your project

// FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpire = Date.now() + 15 * 60 * 1000; // expires in 15 minutes
  user.resetToken = resetToken;
  user.resetTokenExpire = resetTokenExpire;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Hello ${user.fullName},</h3>
      <p>You requested to reset your password.</p>
      <p>Click below link to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <br/><br/>
      <p>If you did not request this, please ignore this email.</p>
      <p>Regards,<br>${process.env.APP_NAME}</p>
    `,
  });

  res.status(200).json({
    message: "Password reset link sent to your email",
  });
});

module.exports = {
  forgotPassword,
};
