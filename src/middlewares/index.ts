import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";
import { errorResponse } from "../response";
import { getUserBySession } from "../db/users";
import { verifyToken } from "../helpers";
import { Blacklist } from "../db/blacklists";

export const DeleteAuthorize = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username } = req.body;
		const currentUsername = get(req, "user.identity.username") as string;

		if (!currentUsername) {
			return errorResponse(401, "UNAUTHORIZE", "User not authorized", res);
		}

		if (currentUsername.toString() !== username) {
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);
		}

		next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Server error: Failed to authenticate",
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
		const apiKey = req.headers["api-key"];
		const authHeader = req.headers["cookie"];
		if (!authHeader)
			return errorResponse(404, "NOT FOUND", "Cookie not found", res);

		const cookie = authHeader.split("=")[1];
		const accessToken = cookie.split(";")[0];

		const checkIfLoggedOut = await Blacklist.findOne({ token: accessToken });

		if (!accessToken || checkIfLoggedOut)
			return errorResponse(400, "ERROR", "Session has expired", res);

		const existingUser = await getUserBySession(accessToken).select(
			"_id identity.username identity.email authentication.key"
		);

		if (!existingUser)
			return errorResponse(401, "UNAUTHORIZE", "Please log in first!", res);

		const PUBLIC_KEY = process.env.PUBLIC_KEY;
		const tokenData = verifyToken(accessToken, PUBLIC_KEY, res) as {
			_id: string;
			username: string;
			email: string;
		};

		const userId = tokenData._id;
		const userEmail = tokenData.email;

		if (!tokenData)
			return errorResponse(400, "ERROR", "Session not found", res);

		if (
			userId !== existingUser._id.toString() ||
			userEmail !== existingUser.identity.email
		)
			return errorResponse(400, "ERROR", "Session invalid", res);

		if (!apiKey)
			return errorResponse(401, "UNAUTHORIZE", "API key is required", res);

		if (apiKey !== existingUser.authentication.key)
			return errorResponse(401, "UNAUTHORIZE", `Invalid API key`, res);

		merge(req, { user: existingUser });
		next();
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Server error: Failed to authenticate",
			res
		);
	}
};
