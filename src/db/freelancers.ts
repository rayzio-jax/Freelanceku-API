import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true, select: false },
		phone: { type: String, required: true },
		address: { type: String, required: true },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "udpated_at" } }
);

export const UserModel = mongoose.model("Freelancer", UserSchema);

export const getFreelancers = () => UserModel.find();
export const getFreelancerByEmail = (email: string) =>
	UserModel.findOne({ email });
export const createFreelancer = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());
