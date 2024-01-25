const { userResponse, statusCodes, defaultSuccessMessage } = require("../constants");
const User = require("../models/user");

const getUserById = async (req, res, next) => {
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

const likeOrDislikeProfile = (req, res) => {
	res.send("You liked/disliked Foo's profile");
};

const deleteAccount = (req, res) => {
	res.send("You deleted your account");
};

module.exports = {
	getUserById,
	likeOrDislikeProfile,
	deleteAccount,
};
