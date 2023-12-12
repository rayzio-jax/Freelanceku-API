import { Router } from "express";

import {
	getAllFreelancer,
	registerFreelancer,
} from "../controllers/freelancers";

export default (router: Router) => {
	router.get("/freelancers", getAllFreelancer);
	router.post("/freelancers", registerFreelancer);
};
