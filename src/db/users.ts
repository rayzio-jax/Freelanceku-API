import "dotenv/config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, max: 20 },
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
			salt: { type: String, select: false },
			password: { type: String, required: true, select: false },
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
	{
		timestamps: { createdAt: "created_at", updatedAt: false },
		toJSON: {
			transform: function (doc: any, ret: any) {
				// Use moment to format timestamps
				ret.localCreatedAt = moment(ret.createdAt).format(
					"YYYY-MM-DDTHH:mm:ss"
				);
				return ret as JSON;
			},
		},
	}
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

export const getUsers = (filter?: Object, sortByUsername?: any) =>
	User.find({}, filter).sort(sortByUsername);
export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserBySession = (sessionToken: string) =>
	User.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) =>
	new User(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
	User.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
	User.findByIdAndUpdate(id, values);
export const updateUserByEmail = (
	email: string,
	values: Record<string, any>
) => {
	User.findOneAndUpdate({ email }, values);
};
