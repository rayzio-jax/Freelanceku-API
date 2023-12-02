import { Router } from "express";

import {
	deleteUser,
	getAllUsers,
	getUsernameAndEmail,
} from "../controllers/users";
import { isAuthToDelete, isAuthenticated } from "../middlewares";

export default (router: Router) => {
	router.get("/users", getUsernameAndEmail);
	router.get("/users/all", isAuthenticated, getAllUsers);
	router.delete("/user", isAuthenticated, isAuthToDelete, deleteUser);
};
