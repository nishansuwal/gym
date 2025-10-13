const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin_schema");
const User = require("../../models/user_schema"); // Assuming you have a User schema
const bcrypt = require("bcryptjs");

const adminSignup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;
    console.log(req.body);
    let errors = [];

    // Validate inputs
    if (!fullName || !email || !password || !confirmPassword || !role) {
      errors.push({ message: "Please enter all the required fields" });
    }
    if (password !== confirmPassword) {
      errors.push({ message: "Passwords do not match" });
    }
    if (password.length < 6) {
      errors.push({ message: "Password must be at least 6 characters" });
    }

    if (errors.length > 0) {
      console.log(errors);
      return res.status(400).json({ errors });
    }

    // Check if the user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ message: "User already exists" }] });
    }
    const secretKey = process.env.JWT_SECRET;

    // Generate a JWT token for approval
    const signUpToken = jwt.sign(
      { fullName, email, password, role }, // Include role in the token
      secretKey,
      { expiresIn: "15m" }
    );

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Super admin email (who will approve the user)
    const superAdminEmail = process.env.GMAIL_USERNAME;

    // Send email to the super admin for approval
    await transporter.sendMail({
      from: '"Farm" <noreply@farm.com>',
      to: superAdminEmail,
      subject: "User Approval Request",
      html: `
        <p>A new ${role} has signed up and needs approval:</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Requested Role:</strong> ${role}</p>
        <p>As a super admin, you can approve this request and change the role if necessary.</p>
        <p>Click the link below to approve or modify the role:</p>
        <a href="${process.env.SERVER_API}/api/admin/approve-user/${signUpToken}">Approve</a>
      `,
    });

    return res.status(200).json({
      message: `Your signup request has been sent to the super admin for approval. You will receive an email once your account is approved.`,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = adminSignup;

// Function to approve user
const approveUser = async (req, res) => {
  const { token } = req.params;
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const { fullName, email, password, role } = decoded;
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const newuser = new Admin({
          fullName,
          email,
          password: hashedPassword,
          resetToken: "",
          role,
          isApproved: true,
        });
        newuser
          .save()
          .then((success) => {
            return res
              .status(200)
              .json({ message: "admin has been saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // const newUser = new Admin({
    //   fullName,
    //   email,
    //   password,
    //   role,
    //   isApproved: true,
    // });
    // await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Notify user of approval
    await transporter.sendMail({
      from: '"Farm" <nishansuwal2020@gmail.com>',
      to: email,
      subject: "Your Account Has Been Approved",
      html: `<p>Hello ${fullName},</p><p>Your account has been approved. You can now log in.</p>`,
    });

    return res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: [{ message: "Invalid or expired token" }] });
  }
};

module.exports = { adminSignup, approveUser };
