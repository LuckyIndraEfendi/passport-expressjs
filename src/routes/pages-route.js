const { Router } = require("express");
const router = Router();

router.get("/dashboard", (req, res) => {
  const user = req?.user;
  res.render("pages/index", {
    user: user,
  });
});

router.get("/sign-in", (req, res) => {
  res.render("pages/sign-in");
});

module.exports = router;
