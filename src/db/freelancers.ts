import mongoose from "mongoose";

const FreelancerSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: true, max: 30 },
		last_name: { type: String, required: true, max: 30 },
		email: {
			type: String,
			required: true,
			max: 30,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			max: 12,
			match: /^\d{0,12}$/,
		},
		country: { type: String, required: true, max: 20, lowercase: true },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Freelancer = mongoose.model("Freelancer", FreelancerSchema);

export const getFreelancers = (sortByFirstname?: any, sortByEmail?: any) =>
	Freelancer.find()?.sort(sortByFirstname || sortByEmail);
export const getFreelancerByEmail = (email: string) =>
	Freelancer.findOne({ email });
export const createFreelancer = (values: Record<string, any>) =>
	new Freelancer(values).save().then((user) => user.toObject());
