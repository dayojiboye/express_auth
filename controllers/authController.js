const jwt = require("jsonwebtoken");
const {
	maxAge,
	statusCodes,
	maxAgeMinutes,
	defaultSuccessMessage,
	userResponse,
} = require("../constants");
const authErrors = require("../utils/authErrorHandler");
const User = require("../models/user");

const createToken = (id) => {
	return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: maxAge,
	});
};

const register = async (req, res) => {
	// const { firstName, lastName, username, email, password, bio, occupation } = req.body;

	try {
		const user = await User.create({
			...req.body,
			followers: [],
		});
		const accessToken = createToken(user._id);
		// res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: maxAge * 1000 });
		res.status(statusCodes.SUCCESSFUL).json({
			message: defaultSuccessMessage,
			data: {
				user: userResponse(user),
				accessToken: {
					token: accessToken,
					expiryTimeInMinutes: maxAgeMinutes,
				},
			},
		});
	} catch (error) {
		const validationError = authErrors(error);
		res.status(statusCodes.VALIDATION_ERROR).json({ message: validationError });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: "All fields are required" });
		return;
	}

	try {
		const user = await User.login(email, password);
		const accessToken = createToken(user._id);
		// res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: maxAge * 1000 });
		res.status(statusCodes.SUCCESSFUL).json({
			message: defaultSuccessMessage,
			data: {
				user: userResponse(user),
				accessToken: {
					token: accessToken,
					expiryTimeInMinutes: maxAgeMinutes,
				},
			},
		});
	} catch (error) {
		const validationError = authErrors(error);
		res.status(statusCodes.VALIDATION_ERROR).json({ message: validationError });
	}
};

module.exports = {
	register,
	login,
};
