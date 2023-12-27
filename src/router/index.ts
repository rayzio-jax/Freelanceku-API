import { Router, Request, Response } from "express";
import authentication from "./authentication";
import users from "./users";
import freelancers from "./freelancers";
import { response, errorResponse } from "../response";

const router = Router();

// Base route
router.get("/v1", (req: Request, res: Response) => {
	try {
		response(200, "SUCCESS", {}, "Welcome to my API", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Internal Server Error", res);
	}
});

export default (): Router => {
	authentication(router);
	users(router);
	freelancers(router);
	return router;
};
