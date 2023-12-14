import { Request, Response } from "express";

import { response, errorResponse } from "../response";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return errorResponse(400, "INVALID", "invalid username or email", res);
		}

		const user = await getUserByEmail(email).select(
			"+authentication.salt +authentication.password"
		);

		if (!user) {
			return errorResponse(403, "FORBIDDEN", "user not encrypted", res);
		}

		const expectedHash = authentication(user.authentication.salt, password);

		if (user.authentication.password != expectedHash) {
			return errorResponse(403, "FORBIDDEN", "password doesn't match", res);
		}

		const salt = random();
		user.authentication.sessionToken = authentication(
			salt,
			user._id.toString()
		);

		await user.save();
		// const url = new URL("https://freelance-api-production.up.railway.app");
		// const domain = url.hostname;
		const domain = "localhost";

		res.cookie("FREEJOB_API", user.authentication.sessionToken, {
			domain: domain,
			path: "/",
		});

		response(200, "SUCCESS", user, "user has successfully logged in", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to log in user", res);
	}
};

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body;
		if (!email || !password || !username) {
			return errorResponse(
				400,
				"INVALID",
				"username, password or email is missing",
				res
			);
		}

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return errorResponse(400, "INVALID", "user existed", res);
		}

		const salt = random();
		const user = await createUser({
			email,
			username,
			authentication: {
				salt,
				password: authentication(salt, password),
			},
		});

		response(200, "SUCCESS", user, "register new user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to register new user", res);
	}
};
