import { Router } from "express";
import { body } from "express-validator";

import Validate from "../middlewares/validate";
import { Login, Logout, Register } from "../controllers/authentication";

export default (router: Router) => {
	router.post(
		"/v1/auth/register",
		body("first_name")
			.optional({ values: "null" })
			.isLength({ max: 30 })
			.withMessage("First name max length is 30")
			.notEmpty()
			.withMessage("First name must be not empty")
			.trim()
			.escape(),
		body("last_name")
			.optional({ values: "null" })
			.isLength({ max: 30 })
			.withMessage("Last name max length is 30")
			.notEmpty()
			.withMessage("Last name must be not empty")
			.trim()
			.escape(),
		body("username")
			.isLength({ max: 20 })
			.withMessage("Username max length is 20")
			.notEmpty()
			.withMessage("Username is required")
			.trim()
			.escape(),
		body("email")
			.normalizeEmail({
				gmail_remove_dots: false,
			})
			.isEmail({ host_blacklist: ["yopmail.com"] })
			.withMessage("Enter a valid email address"),
		body("password")
			.isStrongPassword()
			.withMessage("Password is weak")
			.isLength({ min: 8 })
			.withMessage("Password atleast 8 chars long")
			.notEmpty()
			.withMessage("Password is required"),
		body("phone")
			.optional({ values: "null" })
			.isLength({ max: 15 })
			.withMessage("Phone number max length is 15")
			.isMobilePhone("id-ID")
			.withMessage("Enter a valid phone number")
			.notEmpty()
			.withMessage("Phone number must not be empty"),
		body("street")
			.optional({ values: "null" })
			.toLowerCase()
			.notEmpty()
			.withMessage("Street address must not be empty")
			.trim()
			.escape(),
		body("city")
			.optional({ values: "null" })
			.toLowerCase()
			.notEmpty()
			.withMessage("City address must not be empty")
			.trim()
			.escape(),
		body("province")
			.optional({ values: "null" })
			.toLowerCase()
			.notEmpty()
			.withMessage("Province address must not be empty")
			.trim()
			.escape(),
		body("country")
			.optional({ values: "null" })
			.toLowerCase()
			.notEmpty()
			.withMessage("Country address must not be empty")
			.trim()
			.escape(),
		body("description")
			.optional({ values: "null" })
			.isString()
			.withMessage("User bio must be string")
			.notEmpty()
			.withMessage("User bio must not be empty")
			.trim()
			.escape(),
		Validate,
		Register
	);
	router.post(
		"/v1/auth/login",
		body("email")
			.normalizeEmail({
				gmail_remove_dots: false,
			})
			.isEmail({ host_blacklist: ["yopmail.com"] })
			.withMessage("Invalid email address")
			.notEmpty()
			.withMessage("Email is missing!"),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must 8 characters long")
			.notEmpty()
			.withMessage("Password is missing!"),
		Validate,
		Login
	);
	router.get("/v1/auth/logout", Logout);
};
