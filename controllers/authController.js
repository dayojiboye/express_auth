import jwt from "jsonwebtoken";
import {
	maxAge,
	statusCodes,
	maxAgeMinutes,
	defaultSuccessMessage,
	userResponse,
} from "../constants.js";
import { registrationSchema, loginSchema, authErrors } from "../utils/authErrorHandler.js";
import User from "../models/user.js";

const createToken = (id) => {
	return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: maxAge,
	});
};

export const register = async (req, res) => {
	const { error } = registrationSchema.validate(req.body);

	if (error) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: error.details[0].message });
		return;
	}

	try {
		const user = await User.create(req.body);
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

export const login = async (req, res) => {
	const { email, password } = req.body;
	const { error } = loginSchema.validate(req.body);

	if (error) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: error.details[0].message });
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
