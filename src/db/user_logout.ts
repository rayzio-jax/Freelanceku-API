import mongoose from "mongoose";
const UserLogoutSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			ref: "users",
		},
	},
	{ timestamps: true }
);
export const UserLogout = mongoose.model("UserLogout", UserLogoutSchema);
