module.exports.statusCodes = {
	SUCCESSFUL: 200,
	VALIDATION_ERROR: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
};

module.exports.defaultSuccessMessage = "Request processed successfully";
module.exports.unauthorizedMessage = "Unauthorized";
module.exports.badTokenFormatMessage = "Bad Token Format";
module.exports.serverErrorMessage = "Internal server error";
module.exports.forbiddenErrorMessage = "Forbidden Operation";
module.exports.invalidTokenMessage = "Invalid token";

module.exports.maxAgeMinutes = 15; // 15 minutes

module.exports.maxAge = this.maxAgeMinutes * 60; // 900 seconds

module.exports.userResponse = function (user) {
	return {
		...user.toObject(),
		_id: undefined,
		userId: user._id,
		password: undefined,
		__v: undefined,
	};
};
