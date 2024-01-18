import mongoose from "mongoose";
import _ from "lodash";

function generateID(): string {
	let id = _.times(16, () => ((Math.random() * 0xf) << 0).toString(24)).join(
		""
	);
	return id;
}

const TransactionSchema = new mongoose.Schema(
	{
		_id: { type: String, required: true, default: generateID },
		sender_id: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
			ref: "freelancers",
		},
		receiver_id: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
			ref: "freelancers",
		},
		payment_id: { type: String, required: false },
		amount: { type: Number, max: 10, required: true },
		message: { type: String, max: 100, lowercase: true, required: true },
		status: {
			type: String,
			enum: ["unprocessed", "failed", "pending", "finish"],
			required: true,
			default: "unprocessed",
		},
	},
	{
		timestamps: { updatedAt: false },
	}
);

export const Transaction = mongoose.model("transactions", TransactionSchema);

export const getTransactions = (sorter?: {}) =>
	Transaction.find({}, { __v: 0, createdAt: 0 })?.sort(sorter);

export const createTransaction = async (values: Record<string, any>) =>
	await new Transaction(values).save().then((data) => data.toObject());

const FreelancerSchema = new mongoose.Schema(
	{
		first_name: { type: String, max: 30, required: true, capitalize: true },
		last_name: { type: String, max: 30, required: true, capitalize: true },
		username: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			max: 20,
		},
		email: {
			type: String,
			max: 30,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			max: 15,
			match: /^\d{0,12}$/,
		},
		local_address: {
			address: { type: String, required: true, lowercase: true, max: 100 },
			province: { type: String, required: true, lowercase: true, max: 50 },
			country: { type: String, required: true, lowercase: true, max: 20 },
		},
		description: { type: String, required: true, lowercase: true, max: 1000 },
		transaction: { type: [TransactionSchema], required: false },
	},
	{ timestamps: true }
);

export const Freelancer = mongoose.model("Freelancer", FreelancerSchema);

export const getFreelancers = (filter?: Object, sorter?: {}) =>
	Freelancer.find({}, filter)?.sort(sorter);

export const getFreelancerByEmail = (email: string) =>
	Freelancer.findOne({ email });

export const getFreelancerByUsername = (username: string) =>
	Freelancer.findOne({ username });

export const createFreelancer = async (values: Record<string, any>) =>
	await new Freelancer(values).save().then((user) => user.toObject());

export const updateFreelancerByEmail = async (
	email: string,
	values: Record<string, any>
) => {
	return await Freelancer.findOneAndUpdate({ email }, values, { new: true });
};
