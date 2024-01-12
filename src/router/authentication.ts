import { Router } from "express";
import { body } from "express-validator";

import Validate from "../middlewares/validate";
import { Login, Logout, Register } from "../controllers/authentication";

export default (router: Router) => {
	router.post(
		"/v1/auth/register",
		body("username")
			.notEmpty()
			.withMessage("Username is required")
			.isLength({ max: 20 })
			.withMessage("Username max chars is 20")
			.trim()
			.escape(),
		body("email")
			.notEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Enter a valid email address")
			.normalizeEmail(),
		body("password")
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 8 })
			.withMessage("Password atleast 8 chars long"),
		Validate,
		Register
	);
	router.post(
		"/v1/auth/login",
		body("email")
			.notEmpty()
			.withMessage("Email is missing!")
			.isEmail()
			.withMessage("Invalid email address"),
		body("password").notEmpty().withMessage("Password is missing!"),
		Validate,
		Login
	);
	router.get("/v1/auth/logout", Logout);
};
