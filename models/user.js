import mongoose from "mongoose";
// import { isEmail } from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true],
		},
		lastName: {
			type: String,
			required: [true],
		},
		username: {
			type: String,
			required: [true],
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			required: [true],
		},
		password: {
			type: String,
			required: [true],
		},
		bio: {
			type: String,
			required: [true],
		},
		occupation: {
			type: String,
			required: [true],
		},
		followers: {
			type: [{ name: String, id: String, _id: false }],
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

userSchema.post("findOneAndDelete", function (res) {
	// console.log(res.id, res._id);
	User.updateMany(
		{},
		{
			$pull: {
				followers: {
					id: res.id,
				},
			},
		},
		{ new: true }
	)
		.then((data) => console.log("Successfully deleted user in all followers array"))
		.catch((err) => console.log(err));
});

const User = mongoose.model("user", userSchema);

export default User;
