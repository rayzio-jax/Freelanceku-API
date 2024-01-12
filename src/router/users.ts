import { Router } from "express";

import {
	deleteUser,
	getAllUser,
	getAllUsernameAndEmail,
	updateUser,
} from "../controllers/users";
import { DeleteAuthorize, isAuthenticated } from "../middlewares";

export default (router: Router) => {
	router.get("/v1/users/all", getAllUsernameAndEmail);
	router.get("/v1/users", isAuthenticated, getAllUser);
	router.delete("/v1/users", isAuthenticated, DeleteAuthorize, deleteUser);
	router.patch("/v1/users", isAuthenticated, updateUser);
};
