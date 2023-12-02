import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";
import { error } from "../response";

import { getUserBySession } from "../db/users";

export const isAuthToDelete = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.query.id as string;
		const currentUserId = get(req, "identity._id") as string;

		if (!currentUserId) {
			return error(403, "Current user id not exist: Forbidden", res);
		}

		if (currentUserId.toString() !== id) {
			return error(403, "Unable to delete other user: Forbidden", res);
		}

		next();
	} catch (error) {
		console.log(error);
		return error(400, "Bad request: invalid");
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
			return error(403, "Session not authenticated: Forbidden", res);
		}

		const existingUser = await getUserBySession(sessionToken);
		if (!existingUser) {
			return error(403, "User not logged in: Forbidden", res);
		}

		merge(req, { identity: existingUser });
		return next();
	} catch (error) {
		console.log(error);
		return error(400, "Bad request: invalid");
	}
};
