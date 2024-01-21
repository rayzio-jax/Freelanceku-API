import { Router } from "express";

import {
	getAllTransaction,
	createNewTransaction,
} from "../controllers/transactions";
import Validate from "../middlewares/validate";
import { isAuthenticated } from "../middlewares";
import { body } from "express-validator";

export default (router: Router) => {
	router.get("/v1/transaction", isAuthenticated, getAllTransaction);
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
			.isLength({ min: 4 })
			.withMessage("Minimum amount is 50.000")
			.toInt()
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
