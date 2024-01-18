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
		body("new_username")
			.notEmpty()
			.withMessage("New username is required")
			.toLowerCase(),
		Validate,
		isAuthenticated,
		updateCurrentUser
	);
};
