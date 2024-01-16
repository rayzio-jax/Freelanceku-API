import mongoose from "mongoose";
const BlackListSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			ref: "users",
		},
	},
	{ timestamps: true }
);
export const Blacklist = mongoose.model("Blacklist", BlackListSchema);
