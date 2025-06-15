require("dotenv").config();
const express = require("express");
const app = express();
const winston = require("winston");
const cors = require("cors");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
require("./config/logger");
require("./config/db")();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");
app.set("view engine", "ejs");

app.use("/", require("./routes/index"));
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {app, server};
