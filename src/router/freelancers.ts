import { Router } from "express";

import {
	getAllFreelancer,
	registerFreelancer,
} from "../controllers/freelancers";
import Validate from "../middlewares/validate";
import { isAuthenticated } from "../middlewares";
import { body } from "express-validator";

export default (router: Router) => {
	router.get("/v1/freelancer", isAuthenticated, getAllFreelancer);
	router.post(
		"/v1/freelancer/new",
		body("first_name")
			.notEmpty()
			.withMessage("First name is missing")
			.isLength({ max: 30 })
			.withMessage("First name max length is 30")
			.trim()
			.escape(),
		body("last_name")
			.notEmpty()
			.withMessage("Last name is missing")
			.isLength({ max: 30 })
			.withMessage("Last name max length is 30")
			.trim()
			.escape(),
		body("username")
			.notEmpty()
			.withMessage("Username is required")
			.isLength({ max: 20 })
			.withMessage("Username max length is 20")
			.toLowerCase()
			.trim()
			.escape(),
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Enter a valid email address")
			.normalizeEmail(),
		body("phone")
			.notEmpty()
			.withMessage("Phone number is required")
			.isMobilePhone("any")
			.withMessage("Enter a valid phone number"),
		body("address").notEmpty().withMessage("Address is required").toLowerCase(),
		body("province")
			.notEmpty()
			.withMessage("Province is required")
			.toLowerCase(),
		body("country").notEmpty().withMessage("Country is required").toLowerCase(),
		body("description")
			.notEmpty()
			.withMessage("Freelancer bio is required")
			.isString()
			.withMessage("Freelancer bio must be string")
			.trim()
			.escape(),
		Validate,
		isAuthenticated,
		registerFreelancer
	);
};
