import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";

import { getUserBySession, getUsers } from "../db/users";

export const isAuthToDelete = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.query.id as string;
		const currentUserId = get(req, "identity._id") as string;

		if (!currentUserId) {
			return res.status(403).send("Current user id not exist: Forbidden");
		}

		const currentUsername = get(req, "identity.username") as string;

		if (currentUsername !== "admin" && currentUserId.toString() !== id) {
			return res
				.status(403)
				.send("User is not admin to perform special command: Forbidden");
		}

		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const sessionToken = req.cookies["FREEJOB_API"];
		if (!sessionToken) {
			return res.sendStatus(403);
		}

		const existingUser = await getUserBySession(sessionToken);
		if (!existingUser) {
			return res.sendStatus(403);
		}

		merge(req, { identity: existingUser });
		return next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
