const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { statusCodes, invalidTokenMessage } = require("../constants");

module.exports.checkUser = (req, res, next) => {
	let token;
	let authHeader = req.headers.Authorization || req.headers.authorization;

	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split("Bearer ")[1];
		if (token) {
			jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
				if (err) {
					res.locals.user = null;
					next();
				} else {
					let user = await User.findById(decodedToken.id);
					if (!user) {
						res.locals.user = null;
						res.status(statusCodes.UNAUTHORIZED).json({ message: invalidTokenMessage });
						return;
					}
					res.locals.user = user;
					next();
				}
			});
		} else {
			res.locals.user = null;
			next();
		}
	} else {
		res.locals.user = null;
		next();
	}
};
