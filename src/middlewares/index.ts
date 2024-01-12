import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";
import { errorResponse } from "../response";
import { getUserBySession } from "../db/users";
import { verifyToken } from "../helpers";
import { UserLogout } from "../db/user_logout";

export const DeleteAuthorize = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username } = req.body;
		const currentUsername = get(req, "identity.username") as string;

		if (!currentUsername) {
			return errorResponse(404, "FORBIDDEN", "User Not Logged In", res);
		}

		if (currentUsername.toString() !== username) {
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
		const sessionToken = req.cookies["SessionTokenId"];
		const apiKey = req.headers["api-key"];

		if (!sessionToken) {
			return errorResponse(401, "UNAUTHORIZE", "Session has expired", res);
		}

		const authHeader = req.headers["cookie"]; // get the session cookie from request header
		if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
		const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt token
		const accessToken = cookie.split(";")[0];
		const checkIfLoggedOut = await UserLogout.findOne({ token: accessToken });
		if (checkIfLoggedOut) {
			return errorResponse(401, "UNAUTHORIZE", "Session has expired", res);
		}

		const existingUser = await getUserBySession(sessionToken).select(
			"username authentication.key"
		);

		if (!existingUser) {
			return errorResponse(400, "ERROR", "User not exist", res);
		}

		const PUBLIC_KEY = process.env.PUBLIC_KEY;
		const tokenData = verifyToken(sessionToken, PUBLIC_KEY, res) as {
			_id: string;
		};
		const userId = tokenData._id;

		if (!tokenData || userId !== existingUser._id.toString()) {
			return errorResponse(401, "UNAUTHORIZE", "Session has expired", res);
		}

		if (!apiKey || apiKey !== existingUser.authentication.key) {
			return errorResponse(401, "UNAUTHORIZE", `Invalid API key`, res);
		}

		merge(req, { identity: existingUser });
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
