import { Router, Request, Response } from "express";
import authentication from "./authentication";
import users from "./users";
import freelancers from "./freelancers";

const router = Router();

// Base route
router.get("/", (req: Request, res: Response) => {
	res.send("Welcome to my API");
});

export default (): Router => {
	authentication(router);
	users(router);
	freelancers(router);
	return router;
};
