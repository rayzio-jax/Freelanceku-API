import { Router } from "express";

import {
	getAllTransaction,
	createNewTransaction,
	updateTransactionStatus,
} from "../controllers/transactions";
import Validate from "../middlewares/validate";
import { isAdmin, isAuthenticated } from "../middlewares";
import { body, param, query } from "express-validator";

export default (router: Router) => {
	router.patch(
		"/v1/transaction/status/:_id",
		param("_id")
			.notEmpty()
			.withMessage("Transaction ID or Payment ID is required as parameter"),
		body("new_status")
			.isIn(["UNPROCESSED", "FAILED", "PENDING", "DONE"])
			.withMessage("Status must be one of: UNPROCESSED, FAILED, PENDING, DONE")
			.toUpperCase()
			.isString()
			.withMessage("New status must be string")
			.notEmpty()
			.withMessage("Transaction new status is required"),
		Validate,
		isAuthenticated,
		updateTransactionStatus
	);
	router.get(
		"/v1/transactions",
		query("size").notEmpty().withMessage("Size is required"),
		query("page").notEmpty().withMessage("Page is required"),
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
			.isIn(["UNPROCESSED", "FAILED", "PENDING", "DONE"])
			.withMessage("Status must be one of: UNPROCESSED, FAILED, PENDING, DONE")
			.toUpperCase()
			.escape()
			.trim()
			.notEmpty()
			.withMessage("Status is required"),
		Validate,
		isAuthenticated,
		createNewTransaction
	);
};
