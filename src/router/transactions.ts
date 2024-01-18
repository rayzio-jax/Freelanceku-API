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
		body("sender_email")
			.notEmpty()
			.withMessage("Sender email is missing")
			.isEmail()
			.withMessage("Enter a valid email address")
			.normalizeEmail(),
		body("receiver_email")
			.notEmpty()
			.withMessage("Sender email is missing")
			.isEmail()
			.withMessage("Enter a valid email address")
			.normalizeEmail(),
		body("amount")
			.notEmpty()
			.withMessage("Transaction amount must be not empty")
			.toInt(),
		body("message")
			.notEmpty()
			.withMessage("Transaction message is required")
			.escape(),
		Validate,
		isAuthenticated,
		createNewTransaction
	);
};
