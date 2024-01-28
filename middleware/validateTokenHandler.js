import jwt from "jsonwebtoken";
import {
	statusCodes,
	unauthorizedMessage,
	badTokenFormatMessage,
	invalidTokenMessage,
} from "../constants.js";

const validateToken = function (req, res, next) {
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split("Bearer ")[1];
		if (token) {
			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
				if (err) {
					if (err.message.includes("jwt expired")) {
						res.status(statusCodes.UNAUTHORIZED).json({ message: invalidTokenMessage });
					} else {
						res.status(statusCodes.UNAUTHORIZED).json({ message: unauthorizedMessage });
					}
				} else {
					// console.log("DECODED TOKEN: ", decodedToken);
					next();
				}
			});
		} else {
			res.status(statusCodes.FORBIDDEN).json({ message: badTokenFormatMessage });
		}
	} else {
		res.status(statusCodes.FORBIDDEN).json({ message: badTokenFormatMessage });
	}
};

export default validateToken;
