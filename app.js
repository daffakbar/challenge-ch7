var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const flash = require("express-flash");

const passport = require("./lib/passport");

// import ROUTER
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var roomRouter = require("./routes/room");

// MIDD
var auth = require("./middleware/restrict");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session handler
app.use(
  session({
    secret: "Buat ini jadi rahasia",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Router
app.use("/", usersRouter);
app.use("/", roomRouter);
app.use("/", indexRouter);

// MIDDLEWARE JWT
// app.use(auth.midd);

// Router
app.use("/", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;