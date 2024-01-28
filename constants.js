export const statusCodes = {
	SUCCESSFUL: 200,
	VALIDATION_ERROR: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
};

export const defaultSuccessMessage = "Request processed successfully";
export const unauthorizedMessage = "Unauthorized";
export const badTokenFormatMessage = "Bad Token Format";
export const serverErrorMessage = "Internal server error";
export const forbiddenErrorMessage = "Forbidden Operation";
export const invalidTokenMessage = "Invalid token";
export const userNotFoundMessage = "No user found";

export const maxAgeMinutes = 15; // 15 minutes

export const maxAge = maxAgeMinutes * 60; // 900 seconds

export function userResponse(user) {
	return {
		...user.toObject(),
		_id: undefined,
		userId: user._id,
		password: undefined,
		__v: undefined,
	};
}
