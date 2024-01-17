import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import {
	getFreelancerByEmail,
	getTransactions,
	createTransaction,
} from "../db/freelancers";

export const getAllTransaction = async (req: Request, res: Response) => {
	try {
		const sortByAmount = req?.query?.sortByAmount as string;
		let transactions: Object;

		if (!sortByAmount) {
			transactions = getTransactions();
		} else {
			let amount;
			sortByAmount === "asc" ? (amount = 1) : (amount = -1);

			transactions = getTransactions({ amount });
		}

		return response(200, "SUCCESS", transactions, "Get all transaction", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed get all transaction", res);
	}
};

export const inputFreelanceTransaction = async (
	req: Request,
	res: Response
) => {
	try {
		const { sender_email, receiver_email, amount, message } = req.body;

		if (!amount)
			return errorResponse(400, "ERROR", "No amount on transaction", res);
		if (!message)
			return errorResponse(400, "ERROR", "Message is required", res);

		const sender = getFreelancerByEmail(sender_email);
		const receiver = getFreelancerByEmail(receiver_email);

		const transaction = await createTransaction({
			sender_id: (await sender)._id,
			receiver_id: (await receiver)._id,
			amount,
			message,
		});

		return response(
			200,
			"SUCCESS",
			transaction,
			"New freelancer transaction",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed input new transaction", res);
	}
};
