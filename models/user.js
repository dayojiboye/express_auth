const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "Please enter a first name"],
		},
		lastName: {
			type: String,
			required: [true, "Please enter a last name"],
		},
		username: {
			type: String,
			required: [true, "Please enter a username"],
			unique: true,
			minlength: [6, "Username must be at least 3 characters"],
		},
		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: true,
			lowercase: true,
			validate: [isEmail, "Please enter a valid email"],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: [6, "Password must be at least 6 characters"],
		},
		bio: {
			type: String,
			required: [true, "Please enter a bio"],
			maxlength: [50, "Bio must not be more than 50 characters"],
		},
		occupation: {
			type: String,
			required: [true, "Please enter an occupation"],
		},
		likes: {
			type: Number,
			required: [true],
		},
		dislikes: {
			type: Number,
			required: [true],
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	// Hash password before saving to DB
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error("Invalid email or password");
	}

	throw Error("Invalid email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
