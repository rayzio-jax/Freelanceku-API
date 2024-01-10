import "dotenv/config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			max: 20,
		},
		email: {
			type: String,
			required: true,
			max: 30,
			unique: true,
			lowercase: true,
			trim: true,
		},
		authentication: {
			key: { type: String, select: false },
			password: { type: String, required: true, max: 14, select: false },
			sessionToken: { type: String, select: false },
		},
		role: {
			type: String,
			required: true,
			lowercase: true,
			max: 10,
			default: "r-fa00",
		},
		isVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", function (next) {
	try {
		const user = this;
		if (!user.isNew) return next(); // If the document is not new, skip this step
		const PRIVATE_API = process.env.PRIVATE_API_KEY;
		const payload = {
			username: user.username,
			email: user.email,
		};

		user.authentication.key = jwt.sign(payload, PRIVATE_API, {
			algorithm: "RS256",
		});

		if (!user.isModified("authentication")) return next();
		bcrypt.genSalt(10, (err, salt) => {
			if (err) return next(err);

			bcrypt.hash(user.authentication.password, salt, (err, hash) => {
				if (err) return next(err);
				user.authentication.password = hash;

				next();
			});
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

export const User = mongoose.model("User", UserSchema);

export const getUsers = (filter?: Object, sorter?: {}) =>
	User.find({}, filter).sort(sorter);
export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserByUsername = (username: string) =>
	User.findOne({ username });
export const getUserBySession = (sessionToken: string) =>
	User.findOne({ "authentication.sessionToken": sessionToken });
export const createUser = (values: Record<string, any>) =>
	new User(values).save().then((user) => user.toObject());
export const deleteUserByUsername = (username: string) =>
	User.findOneAndDelete({ username: username });
export const updateUserByEmail = async (
	email: string,
	values: Record<string, any>
) => {
	return await User.findOneAndUpdate({ email }, values, { new: true });
};
