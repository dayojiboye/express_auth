const { userResponse, statusCodes, defaultSuccessMessage } = require("../constants");
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
			console.log(err);
			res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
		});
};

const deleteAccount = (req, res) => {
	res.send("You deleted your account");
};

module.exports = {
	getUserById,
	followOrUnfollowUser,
	deleteAccount,
};
