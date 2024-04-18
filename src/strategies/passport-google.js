const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");

const googleSchema = require("../models/userModel");
const { hash } = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await googleSchema.findById(id);
    if (findUser) {
      return done(null, findUser);
    } else {
      return done(null, null);
    }
  } catch (err) {
    return done(err, null);
  }
});

async function GoogleVerifyCallback(accessToken, refreshToken, profile, done) {
  try {
    let findUser = await googleSchema.findOne({ googleId: profile.id });
    if (!findUser) {
      const hashedPassword = await hash(profile.id, 10);
      const newUser = await googleSchema.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword,
        googleId: profile.id,
      });
      return done(null, newUser);
    }
    return done(null, findUser);
  } catch (err) {
    return done(err, null);
  }
}

module.exports = passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    GoogleVerifyCallback
  )
);
