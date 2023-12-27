import { Router } from "express";

import { Login, Register } from "../controllers/authentication";

export default (router: Router) => {
	router.post("/v1/auth/register", Register);
	router.post("/v1/auth/login", Login);
};
