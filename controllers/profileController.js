import Joi from "joi";
import {
	userResponse,
	statusCodes,
	defaultSuccessMessage,
	forbiddenErrorMessage,
	serverErrorMessage,
	userNotFoundMessage,
} from "../constants.js";
import { followOrUnfollowEnums } from "../enums.js";
import User from "../models/user.js";
import updateFollowers from "../utils/updateFollowersHandler.js";

const deleteAccountSchema = Joi.object({
	reason: Joi.string().required().messages({
		"string.empty": "Reason field is required",
	}),
});

export const getUserById = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (user) {
			res
				.status(statusCodes.SUCCESSFUL)
				.json({ message: defaultSuccessMessage, data: userResponse(user) });
		}
	} catch (error) {
		res.status(statusCodes.NOT_FOUND).json({ message: userNotFoundMessage });
	}
};

export const followOrUnfollowUser = async (req, res) => {
	const userId = req.params.id;
	const { type } = req.query;
	const { firstName, lastName, _id } = res.locals.user;

	if (!type || (type !== followOrUnfollowEnums.FOLLOW && type !== followOrUnfollowEnums.UNFOLLOW)) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: "Type field is required" });
		return;
	}

	if (userId === _id.toString()) {
		res
			.status(statusCodes.FORBIDDEN)
			.json({ message: "Users can not follow or unfollow their own selves" });
		return;
	}

	User.findByIdAndUpdate(userId, updateFollowers(type, firstName, lastName, _id), {
		new: true,
	})
		.then((data) => {
			res.status(statusCodes.SUCCESSFUL).json({ message: defaultSuccessMessage, data });
		})
		.catch((err) => {
			res.status(statusCodes.NOT_FOUND).json({ message: userNotFoundMessage });
		});
};

export const deleteAccount = async (req, res) => {
	const userId = req.params.id;
	const { _id } = res.locals.user || {};
	const { error } = deleteAccountSchema.validate(req.body);

	if (!_id || userId !== _id.toString()) {
		res.status(statusCodes.FORBIDDEN).json({ message: forbiddenErrorMessage });
		return;
	}

	if (error) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: error.details[0].message });
		return;
	}

	try {
		// const data = await User.findByIdAndDelete(userId);
		const data = await User.findOneAndDelete({ _id: userId });
		res.status(statusCodes.SUCCESSFUL).json({
			message: defaultSuccessMessage,
			data: {
				id: data._id,
			},
		});
	} catch (error) {
		res.status(statusCodes.SERVER_ERROR).json({ message: serverErrorMessage });
	}
};
