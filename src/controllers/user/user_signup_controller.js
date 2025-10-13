const jwt = require("jsonwebtoken");
const User = require("../../models/user_schema");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../helper/sendEmail");

const validateSignupInput = ({
  fullName,
  email,
  password,
  confirmPassword,
}) => {
  const errors = [];
  if (!fullName || !email || !password || !confirmPassword)
    errors.push({ message: "Please enter all the required fields" });

  if (password !== confirmPassword)
    errors.push({ message: "Passwords do not match" });

  if (password.length < 6)
    errors.push({ message: "Password must be at least 6 characters" });

  return errors;
};

const adminSignUp = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  const errors = validateSignupInput({
    fullName,
    email,
    password,
    confirmPassword,
  });

  if (errors.length > 0) return res.status(400).json({ errors });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({
      errors: [
        { message: "Email already registered. Please use another email." },
      ],
    });

  const signUpToken = jwt.sign(
    { fullName, email, password, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const approveLink = `${process.env.SERVER_API}/api/auth/activate-account/${signUpToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
      <div style="max-width:640px; background:#fff; padding:30px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1);">
        <h2 style="color:#1e293b;">New Admin Request</h2>
        <p>A new admin has requested access to <strong>${process.env.APP_NAME}</strong>.</p>
        <div style="margin:20px 0; padding:15px; background:#f1f5f9; border-radius:8px;">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        <a href="${approveLink}" style="background:#10b981; color:white; padding:10px 25px; border-radius:5px; text-decoration:none;">✅ Approve Admin</a>
        <p style="margin-top:20px; color:#666;">This message was automatically sent by ${process.env.APP_NAME}.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `Admin Approval Request – ${fullName}`,
    html,
  });

  res.status(200).json({
    success: true,
    message: `Admin signup request sent for approval. Please wait for confirmation.`,
  });
});

const userSignUp = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  const errors = validateSignupInput({
    fullName,
    email,
    password,
    confirmPassword,
  });

  if (errors.length > 0) return res.status(400).json({ errors });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({
      errors: [
        { message: "Email already registered. Please use another email." },
      ],
    });

  const signUpToken = jwt.sign(
    { fullName, email, password, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const verifyLink = `${process.env.SERVER_API}/api/auth/activate-account/${signUpToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width:600px; background:#fff; padding:30px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.1);">
        <h2 style="color:#e11d48;">Welcome to ${process.env.APP_NAME}</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for joining <strong>${process.env.APP_NAME}</strong>! Please verify your email to activate your account.</p>
        <a href="${verifyLink}" style="display:inline-block; padding:10px 20px; background:#e11d48; color:white; border-radius:5px; text-decoration:none;">Verify Email</a>
        <p style="margin-top:20px;">Or copy this link:<br>${verifyLink}</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Welcome to ${process.env.APP_NAME} – Verify Your Email`,
    html,
  });

  res.status(200).json({
    success: true,
    message: `A confirmation email has been sent to ${email}. Please verify your account.`,
  });
});

module.exports = { userSignUp, adminSignUp };
