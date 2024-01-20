import { Router } from "express";

import {
	deleteCurrentUser,
	getAllUser,
	getAllUsernameAndEmail,
	getCurrentUser,
	updateCurrentUser,
} from "../controllers/users";
import Validate from "../middlewares/validate";
import { DeleteAuthorize, isAuthenticated } from "../middlewares";
import { body } from "express-validator";

export default (router: Router) => {
	router.get("/v1/user/public", getAllUsernameAndEmail);
	router.get("/v1/user/:username", isAuthenticated, getCurrentUser);
	router.get("/v1/user", isAuthenticated, getAllUser);
	router.delete(
		"/v1/user/:username",
		isAuthenticated,
		DeleteAuthorize,
		deleteCurrentUser
	);
	router.patch(
		"/v1/user/:username",
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
