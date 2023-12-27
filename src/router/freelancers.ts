import { Router } from "express";

import {
	getAllFreelancer,
	registerFreelancer,
} from "../controllers/freelancers";
import { isAuthenticated } from "../middlewares";

export default (router: Router) => {
	router.get("/v1/freelancers", isAuthenticated, getAllFreelancer);
	router.post("/v1/freelancers", isAuthenticated, registerFreelancer);
};
