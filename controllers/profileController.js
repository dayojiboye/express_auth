const {
	userResponse,
	statusCodes,
	defaultSuccessMessage,
	forbiddenErrorMessage,
	serverErrorMessage,
} = require("../constants");
const { followOrUnfollowEnums } = require("../enums");
const User = require("../models/user");
const updateFollowers = require("../utils/updateFollowersHandler");

const getUserById = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (user) {
			res
				.status(statusCodes.SUCCESSFUL)
				.json({ message: defaultSuccessMessage, data: userResponse(user) });
		}
	} catch (error) {
		res.status(statusCodes.NOT_FOUND).json({ message: "No user found" });
	}
};

const followOrUnfollowUser = async (req, res) => {
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
			.json({ message: "User can not follow or unfollow themselves" });
		return;
	}

	User.findByIdAndUpdate(userId, updateFollowers(type, firstName, lastName, _id), {
		new: true,
		upsert: true,
	})
		.then((data) => {
			res.status(statusCodes.SUCCESSFUL).json({ message: defaultSuccessMessage, data });
		})
		.catch((err) => {
			res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
		});
};

const deleteAccount = async (req, res) => {
	const userId = req.params.id;
	const { _id } = res.locals.user;
	const { reason } = req.body;

	if (userId !== _id.toString()) {
		res.status(statusCodes.FORBIDDEN).json({ message: forbiddenErrorMessage });
	}

	if (!reason) {
		res.status(statusCodes.VALIDATION_ERROR).json({ message: "Reason field is required" });
	}

	try {
		const data = await User.findByIdAndDelete(userId);
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

module.exports = {
	getUserById,
	followOrUnfollowUser,
	deleteAccount,
};
