import mongoose from "mongoose";

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
			password: { type: String, required: true, select: false },
			salt: { type: String, select: false },
			sessionToken: { type: String, select: false },
		},
		role: {
			type: String,
			required: true,
			lowercase: true,
			max: 10,
			default: "r-fa00",
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

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
