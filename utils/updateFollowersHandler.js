const { followOrUnfollowEnums } = require("../enums");

const updateFollowers = (type, firstName, lastName, _id) => {
	switch (type) {
		case followOrUnfollowEnums.FOLLOW:
			return {
				$addToSet: {
					followers: {
						name: firstName + " " + lastName,
						id: _id,
					},
				},
			};

		case followOrUnfollowEnums.UNFOLLOW:
			return {
				$pull: {
					followers: {
						id: _id,
					},
				},
			};

		default:
			return {};
	}
};

module.exports = updateFollowers;
