const googleStrategy = require('./strategy/google');
// const facebookStrategy = require("./strategy/facebook");
const passport = require('passport')
const User  = require('../models/user_schema');

passport.use(googleStrategy);
// passport.use(facebookStrategy);

passport.serializeUser((user,done)=> {
    done(null,user._id);
})

passport.deserializeUser((_id, done)=>{
    User.findById(_id).then((user) => {
        done(null,user);
    }).catch((err) => {
        console.log(err);
    })
})