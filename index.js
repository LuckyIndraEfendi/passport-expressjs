require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./src/configs/dbConfig");
const passport = require("passport");
const path = require("path");
require("./src/strategies/passport-discord");
require("./src/strategies/passport-google");
require("./src/strategies/passport-local");
const authRoute = require("./src/routes/auth-route");
const pageRoute = require("./src/routes/pages-route");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "css")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser("testcookie"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
