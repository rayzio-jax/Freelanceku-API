import mongoose from "mongoose";

const isValidPhoneNumber = (value: string) => {
	return /^\d{0,12}$/.test(value);
};

const UserSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: true, max: 50 },
		last_name: { type: String, required: true, max: 50 },
		email: {
			type: String,
			required: true,
			max: 30,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true, select: false },
		phone: {
			type: String,
			required: true,
			max: 12,
			validator: isValidPhoneNumber,
		},
		country: { type: String, required: true, max: 20, lowercase: true },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const UserModel = mongoose.model("Freelancer", UserSchema);

export const getFreelancers = (sortByFirstname?: any, sortByEmail?: any) =>
	UserModel.find()?.sort(sortByFirstname || sortByEmail);
export const getFreelancerByEmail = (email: string) =>
	UserModel.findOne({ email });
export const createFreelancer = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());
