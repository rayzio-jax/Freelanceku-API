import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import { get } from "lodash";
import {
	getUserByEmail,
	getTransactions,
	createTransaction,
	getTransactionByPaymentId,
} from "../db/users";

export const updateTransaction = async (req: Request, res: Response) => {
	try {
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed update transaction: Internal server error",
			res
		);
	}
};

export const createNewTransaction = async (req: Request, res: Response) => {
	try {
		const { payment_id, receiver_email, amount, message, status } = req.body;

		const paymentID = await getTransactionByPaymentId(payment_id);

		if (paymentID)
			return errorResponse(400, "ERROR", "Transaction log existed", res);

		const senderEmail = get(req, "user.identity.email");

		if (!amount)
			return errorResponse(400, "ERROR", "No amount on transaction", res);

		if (!message)
			return errorResponse(400, "ERROR", "Message is required", res);

		const sender = await getUserByEmail(senderEmail);
		if (!sender)
			return errorResponse(400, "ERROR", "Sender credentials not exist", res);

		const receiver = await getUserByEmail(receiver_email);
		if (!receiver)
			return errorResponse(400, "ERROR", "Receiver credentials not exist", res);

		if (receiver.identity.email === senderEmail)
			return errorResponse(
				400,
				"ERROR",
				"Can not send transaction to yourself",
				res
			);

		if (!payment_id)
			return errorResponse(400, "ERROR", "Payment credentials not exist", res);

		const transaction = await createTransaction({
			payment_id,
			sender: sender._id,
			receiver: receiver._id,
			amount,
			message,
			status,
		});

		return response(
			200,
			"SUCCESS",
			transaction,
			"Success creating new transaction log",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed create new transaction: Internal server error",
			res
		);
	}
};

export const getAllTransaction = async (req: Request, res: Response) => {
	try {
		const sortByAmount = req?.query?.sortByAmount as string;
		let transactions: Object;

		if (!sortByAmount) {
			transactions = await getTransactions();
		} else {
			let amount;
			sortByAmount === "asc" ? (amount = 1) : (amount = -1);

			transactions = await getTransactions({ amount });
		}

		return response(200, "SUCCESS", transactions, "Get all transaction", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed get all transaction: Internal server error",
			res
		);
	}
};
