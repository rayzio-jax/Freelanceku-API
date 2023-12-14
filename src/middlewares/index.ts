import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";

import { errorResponse } from "../response";
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
			return errorResponse(404, "NOT FOUND", "current user id not exist", res);
		}

		if (currentUserId.toString() !== id) {
			return errorResponse(
				403,
				"FORBIDDEN",
				"unable to delete other user",
				res
			);
		}

		next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"server error: failed to verify auth",
			res
		);
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
			return errorResponse(403, "FORBIDDEN", "session not authenticated", res);
		}

		const existingUser = await getUserBySession(sessionToken);
		if (!existingUser) {
			return errorResponse(403, "FORBIDDEN", "user not authenticated", res);
		}

		merge(req, { identity: existingUser });
		return next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"server error: failed to authenticate",
			res
		);
	}
};
