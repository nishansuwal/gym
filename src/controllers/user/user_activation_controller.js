const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user_schema')

const userSetActive = async (req, res) => {
  const { token } = req.params;
  try {
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        async (err, decodedToken) => {
          if (err) {
            return res.status(400).json({ error: "This link has been expired" });
          }
          const { fullName, email, password,role } = decodedToken;
          const user = await User.findOne({ email })
          if (user) {
            return res
              .status(200)
              .json({ error: "user with this email address already exists" });
          }
          const hashedPassword = await bcrypt.hash(password, 12)
          const newuser = new User({
            fullName,
            email,
            password: hashedPassword,
            resetToken: "",
            picture: "",
            role: role || "user",
          });
          const userSaved = await newuser.save();
          return res
            .status(200)
            .json({ message: "Your account has been activated successfully. Thank you!" });

        });
    }

  } catch (err) {
    console.log(err);
  }
};

module.exports = userSetActive
