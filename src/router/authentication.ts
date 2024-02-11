import { Router } from "express";
import { body } from "express-validator";

import Validate from "../middlewares/validate";
import { Login, Logout, Register } from "../controllers/authentication";

export default (router: Router) => {
	router.post(
		"/v1/auth/register",
		body("first_name")
			.trim()
			.escape()
			.isLength({ max: 30 })
			.withMessage("First name max length is 30")
			.notEmpty()
			.withMessage("First name is required"),
		body("last_name")
			.trim()
			.escape()
			.isLength({ max: 30 })
			.withMessage("Last name max length is 30")
			.notEmpty()
			.withMessage("Last name is required"),
		body("username")
			.trim()
			.escape()
			.isLength({ max: 20 })
			.withMessage("Username max length is 20")
			.notEmpty()
			.withMessage("Username is required"),
		body("email")
			.normalizeEmail({
				gmail_remove_dots: false,
			})
			.isEmail({ host_blacklist: ["yopmail.com"] })
			.withMessage("Enter a valid email address"),
		body("password")
			.isStrongPassword({
				minLength: 8, // Minimum length . Default is 8 characters
				minLowercase: 1, // Minimum lowercase letters. Default is 1
				minUppercase: 1, // Minimum uppercase letters. Default is 1
				minNumbers: 1, // Minimum numbers. Default is 1
				minSymbols: 1, // Minimum symbols. Default is 1
				returnScore: false, // When enabled, it will return the actual score. Default is false
				pointsPerUnique: 1, // Points for every unique character. Default is 1
				pointsPerRepeat: 0.5, // Points for every repeated character. Default is 0.5
				pointsForContainingLower: 10, // Points for containing lowercase letters. Default is 10
				pointsForContainingUpper: 10, // Points for containing uppercase letters. Default is 10
				pointsForContainingNumber: 10, // Points for containing numbers. Default is 10
				pointsForContainingSymbol: 10, // Points for containing symbols. Default is 10
			})
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
