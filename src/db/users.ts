import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		authentication: {
			password: { type: String, required: true, select: false },
			salt: { type: String, select: false },
			sessionToken: { type: String, select: false },
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = (filter?: Object, sortByUsername?: any) =>
	UserModel.find({}, filter).sort(sortByUsername);
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySession = (sessionToken: string) =>
	UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
	UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
	UserModel.findByIdAndUpdate(id, values);
