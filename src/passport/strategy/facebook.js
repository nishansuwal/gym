// const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/user_schema");
const bcrypt = require("bcryptjs");

const DEFAULT_PROFILE_PICTURE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrphK4DN9nM_IylRROwkqYryIrr79iVvTPTA&usqp=CAU";

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    // callbackURL: "http://localhost:4001/api/auth/facebook/callback",
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "displayName", "photos", "email"], 
    enableProof: false,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let currentUser = await User.findOne({ email: profile._json.email });
      if (currentUser) {
        done(null, currentUser);
        console.log("user found");
      } else {
        const name = profile.displayName || profile._json.name;
        const emails = name.replace(/\s/g, "").toLowerCase();
        const fakeemail = emails + "@gmail.com"
        const UserEmail = profile.email || fakeemail;
        console.log(profile);
        console.log(UserEmail);
        const picture =
          profile._json.picture && profile._json.picture.data
            ? // ? profile._json.picture.data.url
              profile._json.picture.data.url.replace(/\\/g, "")
            : DEFAULT_PROFILE_PICTURE;
        const displayName = profile.displayName || profile._json.name;
        const password = displayName;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          fullName: displayName,
          //   email: profile._json.email,
          email: UserEmail,
          password: hashedPassword,
          resetToken: "",
          picture: picture,
          //   picture: profile._json.picture,
        });
        const userSaved = await newUser.save();
        console.log("data facebook", userSaved);
        done(null, userSaved);
      }
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  }
);

module.exports = facebookStrategy;
