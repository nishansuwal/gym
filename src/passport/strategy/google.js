const GoogleStrategy = require('passport-google-oauth20');
const User = require('../../models/user_schema');
const bcrypt = require('bcryptjs');

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let currentUser = await User.findOne({ email: profile._json.email });
            if (currentUser) {
                done(null, currentUser);
            } else {
                const password = profile._json.email + profile.displayName;
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = new User({
                    fullName: profile._json.given_name + " " + profile._json.family_name,
                    email: profile._json.email,
                    password: hashedPassword,
                    resetToken: '',
                    picture: profile._json.picture
                });
                const userSaved = await newUser.save();
                done(null, userSaved);
            }
        } catch (err) {
            console.log(err);
            done(err, null);
        }
    }
);

module.exports = googleStrategy;
