import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import _ from "lodash";

function generateID(): string {
	let id = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < 16; i++) {
		id += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return id;
}

const TransactionSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
			default: generateID,
		},
		payment_id: { type: String, required: false },
		sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
		receiver: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
		amount: { type: Number, min: 50000, required: true },
		message: { type: String, max: 100, uppercase: true, required: true },
		status: {
			type: String,
			uppercase: true,
			enum: ["UNPROCESSED", "FAILED", "PENDING", "DONE"],
			required: true,
			default: "UNPROCESSED",
		},
	},
	{
		timestamps: { updatedAt: false },
	}
);

export const Transaction = mongoose.model("transactions", TransactionSchema);

export const getTransactions = (sorter?: {}) =>
	Transaction.find({}, { __v: 0, createdAt: 0 })
		?.populate(
			"sender",
			"identity.first_name identity.last_name identity.email"
		)
		?.populate(
			"receiver",
			"identity.first_name identity.last_name identity.email"
		)
		?.sort(sorter);

export const getTransactionByPaymentId = (payment_id: string) =>
	Transaction.findOne({ payment_id })
		?.populate(
			"sender",
			"identity.first_name identity.last_name identity.email"
		)
		?.populate(
			"receiver",
			"identity.first_name identity.last_name identity.email"
		);

export const createTransaction = async (values: Record<string, any>) => {
	const sender = await User.findById(values.sender);
	const receiver = await User.findById(values.receiver);

	if (!sender || !receiver) throw new Error("Sender or receiver not exist");

	if (values.sender.equals(values.receiver))
		throw new Error("Sender and receiver cannot be the same user");

	// Create a new transaction
	const transaction = new Transaction(values);
	await transaction.save();

	// Add the transaction to the sender and receiver's transaction history
	sender.transaction.push(transaction);
	receiver.transaction.push(transaction);
	await sender.save();
	await receiver.save();

	// Populate the sender and receiver fields
	const populatedTransaction = await Transaction.findById(transaction._id)
		?.populate(
			"sender",
			"identity.first_name identity.last_name identity.email"
		)
		?.populate(
			"receiver",
			"identity.first_name identity.last_name identity.email"
		);

	return populatedTransaction.toObject();
};

const UserSchema = new mongoose.Schema(
	{
		identity: {
			first_name: {
				type: String,
				max: 30,
				uppercase: true,
				default: "unknown",
			},
			last_name: {
				type: String,
				max: 30,
				uppercase: true,
				default: "unknown",
			},
			username: {
				type: String,
				required: true,
				uniqe: true,
				lowercase: true,
				trim: true,
				max: 20,
				default: "user",
			},
			email: {
				type: String,
				max: 30,
				required: true,
				unique: true,
				lowercase: true,
				trim: true,
				default: "user@email.com",
			},
			phone: {
				type: String,
				max: 15,
				match: /^\d{0,15}$/,
				default: 0,
			},
			role: {
				type: String,
				enum: ["r-fa00", "r-fa07"],
				lowercase: true,
				max: 10,
				default: "r-fa07",
			},
			description: {
				type: String,
				uppercase: true,
				max: 1000,
				default: "No Description",
			},
		},
		authentication: {
			key: { type: String, select: false },
			password: { type: String, required: true, min: 8, select: false },
			sessionToken: { type: String, select: false },
		},
		address: {
			street: { type: String, uppercase: true, max: 60, default: "None" },
			city: { type: String, uppercase: true, max: 30, default: "None" },
			province: { type: String, uppercase: true, max: 20, default: "None" },
			country: { type: String, uppercase: true, max: 15, default: "None" },
		},
		verification: {
			emailIsVerified: {
				type: Boolean,
				default: false,
				select: false,
			},
			phoneIsVerified: {
				type: Boolean,
				default: false,
				select: false,
			},
		},
		transaction: { type: [TransactionSchema] },
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (!user.isNew) return next(); // If the document is not new, skip this step

		const token = crypto.randomUUID();

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(token, salt);
		user.authentication.key = hash;

		if (user.isModified("authentication.password")) {
			const passwordSalt = await bcrypt.genSalt(10);
			const passwordHash = await bcrypt.hash(
				user.authentication.password,
				passwordSalt
			);

			user.authentication.password = passwordHash;
		}

		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
});

export const User = mongoose.model("User", UserSchema);

export const getUsers = (filter?: Object, sorter?: {}) =>
	User.find({}, filter).sort(sorter);

export const getUserById = (_id: string) => User.findOne({ _id });

export const getUserByEmail = (email: string) =>
	User.findOne({ "identity.email": email });

export const getUserByUsername = (username: string) =>
	User.findOne({ "identity.username": username });

export const getUserBySession = (sessionToken: string) =>
	User.findOne({ "authentication.sessionToken": sessionToken });

export const createUser = async (values: Record<string, any>) =>
	await new User(values).save().then((user) => user.toObject());

export const deleteUserByUsername = (username: string) =>
	User.findOneAndDelete({ "identity.username": username });

export const updateUserByUsername = async (
	username: string,
	values: Record<string, any>
) => {
	return await User.findOneAndUpdate(
		{ "identity.username": username },
		values,
		{ new: true }
	);
};
