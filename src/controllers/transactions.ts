import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import { get } from "lodash";
import {
	getUserByEmail,
	getTransactions,
	createTransaction,
	getTransactionByPaymentId,
	updateTransactionById,
	getTransactionById,
	countTransactions,
	updateTransactionByPaymentId,
} from "../db/users";

export const updateTransByIdOrPayId = async (req: Request, res: Response) => {
	try {
		const { _id } = req.params;
		const {
			new_payment_id,
			new_sender_id,
			new_receiver_id,
			new_amount,
			new_message,
			new_status,
		} = req.body;

		const matchStatus = ["UNPROCESSED", "FAILED", "PENDING", "DONE"];

		if (!matchStatus.includes(new_status))
			return errorResponse(400, "ERROR", "Invalid transaction status", res);

		let updateById = await updateTransactionById(_id, {
			payment_id: new_payment_id,
			sender: new_sender_id,
			receiver: new_receiver_id,
			amount: new_amount,
			message: new_message,
			status: new_status,
		});

		if (!updateById) {
			updateById = await updateTransactionByPaymentId(_id, {
				payment_id: new_payment_id,
				sender: new_sender_id,
				receiver: new_receiver_id,
				amount: new_amount,
				message: new_message,
				status: new_status,
			});

			if (!updateById)
				return errorResponse(
					400,
					"ERROR",
					"Transaction not exist with this ID",
					res
				);
		}

		return response(
			200,
			"SUCCESS",
			updateById,
			"Update transaction successful",
			res
		);
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
			return errorResponse(400, "ERROR", "Transaction log exist", res);

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

export const getTransByIdOrPaymentId = async (req: Request, res: Response) => {
	try {
		const { _id } = req.params;

		if (!_id)
			return errorResponse(400, "ERROR", "Invalid or missing parameter", res);

		let transaction = await getTransactionById(_id);
		if (!transaction) {
			transaction = await getTransactionByPaymentId(_id);
			if (!transaction)
				return errorResponse(400, "ERROR", "Transaction not exist", res);
		}

		return response(
			200,
			"SUCCESS",
			transaction,
			"Find transaction successful",
			res
		);
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

export const getAllTransaction = async (req: Request, res: Response) => {
	try {
		let size = parseInt(req.query.size as string);
		let page = parseInt(req.query.page as string);
		const { sortBy, sortOrder } = req.query;
		let sorter: string;
		let sorting: {};
		let order: number;
		let orderText: string;
		let transactions: Object;

		sortOrder === "desc" ? (order = -1) : (order = 1);
		sortBy === "amount"
			? (sorter = "amount")
			: sortBy === "status"
			? (sorter = "status")
			: (sorter = "status");

		if (sorter === "amount") {
			sorting = {
				amount: order,
			};
		} else {
			sorting = {
				status: order,
			};
		}

		order === 1 ? (orderText = "asc") : (orderText = "desc");
		const count = await countTransactions();

		if (!sortOrder || sortOrder === "") {
			transactions = await getTransactions(size, page, sorting);
		} else {
			transactions = await getTransactions(size, page, sorting);
		}

		return response(
			200,
			"SUCCESS",
			transactions,
			"Get all transaction",
			res,
			count,
			size,
			page,
			sortBy as string,
			orderText
		);
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
