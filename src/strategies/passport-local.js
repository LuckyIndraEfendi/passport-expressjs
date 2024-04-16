const passport = require("passport");
const { Strategy } = require("passport-local");
const { compare } = require("bcrypt");
const userLocal = require("../models/userModel");
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await userLocal.findById(id);
    if (findUser) {
      return done(null, findUser);
    } else {
      return done(null, null);
    }
  } catch (err) {
    return done(err, null);
  }
});
async function verifyCallback(email, password, done) {
  try {
    const user = await userLocal.findOne({ email });
    if (!user) {
      return done(null, false, { message: "Invalid Credentials" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "Invalid Credentials" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
module.exports = passport.use(
  new Strategy({ usernameField: "email" }, verifyCallback)
);
