const authErrors = (err) => {
	// console.log(err.message, err.code);

	let errors = {
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		bio: "",
		occupation: "",
	};

	// Duplicate error codes
	if (err.code === 11000) {
		// Duplicate username error code
		if (err.message.includes("username")) {
			errors.username = "Username already taken";
			return Object.values(errors).filter((val) => val)[0];
		}

		// Duplicate email error code
		if (err.message.includes("email")) {
			errors.email = "Email already taken";
			return Object.values(errors).filter((val) => val)[0];
		}
	}

	// Validation errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	// Incorrect email error
	if (err.message === "Invalid email") {
		errors.email = err.message;
	}

	// Incorrect password error
	if (err.message === "Invalid email or password") {
		errors.password = err.message;
	}

	return Object.values(errors).filter((val) => val)[0];
};

module.exports = authErrors;
