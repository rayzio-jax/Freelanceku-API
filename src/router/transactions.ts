import { Router } from "express";

import {
	getAllTransaction,
	createNewTransaction,
	updateTransByIdOrPayId,
	getTransByIdOrPaymentId,
	deleteTransByIdOrPaymentId,
} from "../controllers/transactions";
import Validate from "../middlewares/validate";
import { isAdmin, isAuthenticated } from "../middlewares";
import { body, param, query } from "express-validator";

export default (router: Router) => {
	router.delete("/v1/transaction/:_id"),
		param("_id").notEmpty().withMessage("Invalid or missing parameter"),
		Validate,
		isAuthenticated,
		isAdmin,
		deleteTransByIdOrPaymentId;
	router.get("/v1/transaction/:_id");
	param("_id").notEmpty().withMessage("Invalid or missing parameter"),
		Validate,
		isAuthenticated,
		isAdmin,
		getTransByIdOrPaymentId;
	router.get(
		"/v1/transactions",
		query("size").notEmpty().withMessage("Param 'size' is required"),
		query("page").notEmpty().withMessage("Param 'page' is required"),
		Validate,
		isAuthenticated,
		isAdmin,
		getAllTransaction
	);
	router.post(
		"/v1/transaction/new",
		body("payment_id").notEmpty().withMessage("Payment ID is missing"),
		body("receiver_email")
			.normalizeEmail({
				gmail_remove_dots: false,
			})
			.isEmail({ host_blacklist: ["yopmail.com"] })
			.withMessage("Enter a valid email address"),
		body("amount")
			.toInt()
			.isInt({ min: 50000 })
			.withMessage("Minimum amount is 50.000")
			.isNumeric()
			.withMessage("Amount must be number, not string")
			.notEmpty()
			.withMessage("Transaction amount is required"),
		body("message")
			.escape()
			.trim()
			.notEmpty()
			.withMessage("Transaction message is required"),
		body("status")
			.trim()
			.escape()
			.toUpperCase()
			.isIn(["UNPROCESSED", "FAILED", "PENDING", "DONE"])
			.withMessage("Status must be one of: UNPROCESSED, FAILED, PENDING, DONE")
			.notEmpty()
			.withMessage("Status is required"),
		Validate,
		isAuthenticated,
		createNewTransaction
	);
	router.patch(
		"/v1/transaction/:_id",
		param("_id")
			.notEmpty()
			.withMessage("Transaction ID or Payment ID is required as parameter"),
		body("new_payment_id")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.isString()
			.withMessage("Invalid new payment id format, only accept string"),
		body("new_sender_id")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.isString()
			.withMessage("Invalid new sender id format, only accept string"),
		body("new_receiver_id")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.isString()
			.withMessage("Invalid new receiver id format, only accept string"),
		body("new_amount")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.isNumeric()
			.withMessage("Invalid new amount format, only accept number/integer"),
		body("new_message")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.isString()
			.withMessage("Invalid new message format, only accept string"),
		body("new_status")
			.optional({ values: "falsy" })
			.trim()
			.escape()
			.toUpperCase()
			.isIn(["UNPROCESSED", "FAILED", "PENDING", "DONE"])
			.withMessage("Status must be one of: UNPROCESSED, FAILED, PENDING, DONE")
			.isString()
			.withMessage("New status must be string"),
		Validate,
		isAuthenticated,
		isAdmin,
		updateTransByIdOrPayId
	);
};
