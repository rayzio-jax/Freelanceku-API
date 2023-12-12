import { Request, Response } from "express";

import { response, errorResponse } from "../response";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return errorResponse(400, "invalid username or email: Invalid", res);
		}

		const user = await getUserByEmail(email).select(
			"+authentication.salt +authentication.password"
		);

		if (!user) {
			return errorResponse(400, "user not encrypted: Invalid", res);
		}

		const expectedHash = authentication(user.authentication.salt, password);

		if (user.authentication.password != expectedHash) {
			return errorResponse(
				403,
				"user password doesn't match with encrypted: Forbidden",
				res
			);
		}

		const salt = random();
		user.authentication.sessionToken = authentication(
			salt,
			user._id.toString()
		);

		await user.save();
		res.cookie("FREEJOB_API", user.authentication.sessionToken, {
			domain: "localhost",
			path: "/",
		});

		// res.status(200).json(user).end();
		response(200, user, "log in: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "bad request: invalid", res);
	}
};

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body;
		if (!email || !password || !username) {
			return errorResponse(400, "bad request: invalid", res);
		}

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return errorResponse(400, "bad request: invalid", res);
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

		// return res.status(200).json(user).end();
		response(200, user, "register new user: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "bad request: invalid", res);
	}
};
