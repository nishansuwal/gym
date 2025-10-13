const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin_schema");

const adminSignin = async (req, res) => {
  // console.log("object");
  try {
    const { email, password, userType } = req.body;
    // console.log(email);
    // console.log(password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please enter all the required fields" });
    }

    let User;

    User = await Admin.findOne({ email });
    // console.log(User);

    if (!User || !(await bcrypt.compare(password, User.password))) {
      console.log("Invalid email or password");
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!User.isApproved) {
      return res
        .status(403)
        .json({ error: "Your account is pending approval by the admin." });
    }
    const secretKey = process.env.JWT_SECRET;

    const accessToken = jwt.sign({ _id: User._id }, secretKey);

    const { fullName, role, _id } = User;
    res.status(200).json({
      accessToken,
      role,
      userData: { fullName, email, role, _id },
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = adminSignin;
