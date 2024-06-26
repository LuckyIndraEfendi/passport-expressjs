const { Router } = require("express");
const passport = require("passport");
const router = Router();

// Discord Auth
router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/dashboard");
});

// Local Auth
router.post("/sign-in", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

router.get("/status", (req, res) => {
  res.json({ message: "Welcome to the API", data: req.user ? req.user : [] });
});

module.exports = router;
