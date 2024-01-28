import createError from "http-errors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import validateToken from "./middleware/validateTokenHandler.js";
import checkUser from "./middleware/checkUserHandler.js";

const app = express();

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default app;
