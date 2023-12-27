import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";
import { errorResponse } from "../response";
import { getUserBySession } from "../db/users";
import { verifyToken } from "../helpers";

export const isAuthToDelete = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.query.id as string;
		const currentUserId = get(req, "identity._id") as string;

		if (!currentUserId) {
			return errorResponse(404, "NOT FOUND", "Current User Not Exist", res);
		}

		if (currentUserId.toString() !== id) {
			return errorResponse(
				403,
				"FORBIDDEN",
				"Unable To Delete Other User",
				res
			);
		}

		next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Server Error: Failed To Authenticate",
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
		const sessionToken = req.cookies["SessionTokenId"];
		const apiKey = req.headers.authorization;

		if (!sessionToken) {
			return errorResponse(
				401,
				"UNAUTHORIZE",
				"Session Not Authenticated",
				res
			);
		}

		const existingUser = await getUserBySession(sessionToken).select(
			"authentication.key"
		);

		if (!existingUser) {
			return errorResponse(400, "ERROR", "User doesn't exist", res);
		}

		const PUBLIC_KEY = process.env.PUBLIC_KEY;
		const tokenData = verifyToken(sessionToken, PUBLIC_KEY, res) as {
			_id: string;
		};
		const userId = tokenData._id;

		if (!tokenData || userId !== existingUser._id.toString()) {
			return errorResponse(401, "UNAUTHORIZE", "Session Expired", res);
		}

		if (!apiKey || apiKey !== existingUser.authentication.key) {
			return errorResponse(401, "UNAUTHORIZE", `Invalid API Key`, res);
		}

		merge(req, { identity: existingUser });
		next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Server Error: Failed To Authenticate",
			res
		);
	}
};
