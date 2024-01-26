const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
const { validateToken } = require("./middleware/validateTokenHandler");
const { checkUser } = require("./middleware/checkUserHandler");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Database connection
mongoose
	.connect(process.env.DB_URI)
	.then((result) => {
		app.listen(process.env.PORT);
		console.log(`Connected to DB at port ${process.env.PORT}`);
	})
	.catch((err) => console.log(err));

// Routes
app.use("*", checkUser);
app.use("/", indexRouter);
app.use(authRouter);
app.use("/profile", validateToken, profileRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
