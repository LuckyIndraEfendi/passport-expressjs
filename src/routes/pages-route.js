const { Router } = require("express");
const router = Router();

router.get("/dashboard", (req, res) => {
  const user = req?.user;
  res.render("pages/index", {
    user: user,
  });
});

router.get("/sign-in", (req, res) => {
  const isAuthenticated = req?.user;
  if (!isAuthenticated) {
    res.render("pages/sign-in");
    return res.redirect("/sign-in");
  }
  res.redirect("/dashboard");
});

module.exports = router;
