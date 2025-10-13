const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user_schema");

const userSignIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(201)
      .json({ error: "please enter all the required fields" });
  }
  try {
    const isUserExists = await User.findOne({ email: email });
    if (!isUserExists) {
      return res.status(201).json({
        error: "email or password may be invalid, please try again",
      });
    } else {
      const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExists.password
      );

      if (!isPasswordMatched) {
        return res.status(201).json({
          error: "email or password may be invalid, please try again",
        });
      } else {
        const accessToken = jwt.sign(
          {
            _id: isUserExists._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { _id: isUserExists._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" } // 7 days
        );

        isUserExists.refreshToken = refreshToken;
        await isUserExists.save();

        const { fullName, email,role } = isUserExists;
        res.status(200).json({
          accessToken,
          refreshToken,
          currentUser: { fullName, email,role },
          message: "login successfull",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = userSignIn;
