import { Router } from "express";

import {
	deleteCurrentUser,
	getAUserByUsername,
	getAllUser,
	getAllUsernameAndEmail,
	getCurrentUser,
	updateCurrentUser,
	updateUserAsAdmin,
} from "../controllers/users";
import Validate from "../middlewares/validate";
import { isAuthenticated } from "../middlewares";
import { body, param, query } from "express-validator";

export default (router: Router) => {
	router.get(
		"/v1/user/find",
		query("username").notEmpty().withMessage("Username is required as query"),
		Validate,
		isAuthenticated,
		getAUserByUsername
	);
	router.get(
		"/v1/users/public",
		query("size").notEmpty().withMessage("Param 'size' is required"),
		query("page").notEmpty().withMessage("Param 'page' is required"),
		Validate,
		getAllUsernameAndEmail
	);
	router.get(
		"/v1/user/:username",
		param("username")
			.notEmpty()
			.withMessage("Username is required as url parameter"),
		Validate,
		isAuthenticated,
		getCurrentUser
	);
	router.get(
		"/v1/users",
		query("size").notEmpty().withMessage("Param 'size' is required"),
		query("page").notEmpty().withMessage("Param 'page' is required"),
		Validate,
		isAuthenticated,
		getAllUser
	);
	router.delete("/v1/user/:username", isAuthenticated, deleteCurrentUser);
	router.patch(
		"/v1/user-as-admin",
		body("email")
			.normalizeEmail({
				gmail_remove_dots: false,
			})
			.isEmail({ host_blacklist: ["yopmail.com"] })
			.withMessage("Enter a valid email address"),
		body("password").notEmpty().withMessage("Password is missing!"),
		body("api_key").notEmpty().withMessage("API Key is missing!"),
		body("admin_key").notEmpty().withMessage("Admin Key is missing!"),
		body("new_role").notEmpty().withMessage("New role is missing!"),
		Validate,
		isAuthenticated,
		updateUserAsAdmin
	);
	router.patch(
		"/v1/user/:username",
		param("username")
			.notEmpty()
			.withMessage("Username is required as url parameter"),
		body("new_first_name")
			.optional({ values: "falsy" })
			.isLength({ max: 30 })
			.withMessage("New first name max length is 30")
			.trim()
			.escape(),
		body("new_last_name")
			.optional({ values: "falsy" })
			.isLength({ max: 30 })
			.withMessage("New last name max length is 30")
			.trim()
			.escape(),
		body("new_username")
			.optional({ values: "falsy" })
			.isLength({ max: 20 })
			.withMessage("Username max length is 20")
			.trim()
			.escape(),
		body("new_phone")
			.optional({ values: "falsy" })
			.isLength({ max: 15 })
			.withMessage("Phone number max length is 15")
			.isMobilePhone("id-ID")
			.withMessage("Enter a valid phone number"),
		body("new_street")
			.optional({ values: "falsy" })
			.toLowerCase()
			.trim()
			.escape(),
		body("new_city")
			.optional({ values: "falsy" })
			.toLowerCase()
			.trim()
			.escape(),
		body("new_province")
			.optional({ values: "falsy" })
			.toLowerCase()
			.trim()
			.escape(),
		body("new_country")
			.optional({ values: "falsy" })
			.toLowerCase()
			.trim()
			.escape(),
		body("new_description")
			.optional({ values: "falsy" })
			.isString()
			.withMessage("User bio must be string")
			.trim()
			.escape(),
		Validate,
		isAuthenticated,
		updateCurrentUser
	);
};
