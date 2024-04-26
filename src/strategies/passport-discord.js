const passport = require("passport");
const { Strategy } = require("passport-discord");
const discordSchema = require("../models/userModel");
const { hash } = require("bcrypt");
const generateRandomPassword = require("../utils/g-random-pass");

const password = generateRandomPassword(10);
passport.serializeUser((user, done) => {
  done(null, user.id); // Melakukan serialize user dengan discordId dan menyimpannya di session lalu mengirimkan ke deserializeUser
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await discordSchema.findById(id); // Mencari user berdasarkan discordId
    if (findUser) {
      return done(null, findUser);
    } else {
      return done(null, null);
    }
  } catch (err) {
    return done(err, null);
  }
});

async function DiscordVerifyCallback(accessToken, refreshToken, profile, done) {
  try {
    let findUser = await discordSchema.findOne({ discordId: profile.id });
    if (!findUser) {
      const hashedPassword = await hash(password, 10);
      const newUser = await discordSchema.create({
        username: profile.username,
        email: profile.email,
        password: hashedPassword,
        discordId: profile.id,
      });
      // do something with the password, like send it to the user's email
      console.log(`Here is your Password : ${password}`);
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
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.PUBLIC_REDIRECT}/api/auth/discord/redirect`,
      scope: ["identify", "email"],
    },
    DiscordVerifyCallback
  )
);
