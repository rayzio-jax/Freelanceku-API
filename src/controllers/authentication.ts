import "dotenv/config";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { response, errorResponse } from "../response";
import { createUser, getUserByEmail, getUserByUsername } from "../db/users";
import jwt from "jsonwebtoken";
import moment from "moment";
import { Blacklist } from "../db/blacklists";

export const Logout = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers["cookie"];
		if (!authHeader)
			return errorResponse(401, "UNAUTHORIZE", "Session not found", res);

		const cookie = authHeader.split("=")[1];
		const accessToken = cookie.split(";")[0];

		if (!accessToken) return res.sendStatus(204);
		const checkToken = await Blacklist.findOne({ token: accessToken });
		if (checkToken) return res.sendStatus(204);

		const logoutUser = new Blacklist({
			token: accessToken,
		});
		await logoutUser.save();
		res.setHeader("Clear-Site-Data", '"cookies"');
		return response(200, "SUCCESS", "", "You have been logged out!", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed log out user: Internal server error",
			res
		);
	}
};

export const Login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return errorResponse(400, "ERROR", "Wrong email or password!", res);
		}

		const user = await getUserByEmail(email).select(
			"+authentication.password +authentication.key +authentication.salt"
		);

		if (!user) {
			return errorResponse(403, "FORBIDDEN", "User does not exist", res);
		}

		const expectedHash = await bcrypt.compare(
			password,
			user.authentication.password
		);
		if (!expectedHash) {
			return errorResponse(400, "ERROR", "Wrong email or password!", res);
		}

		const payload = {
			_id: user._id,
			username: user.identity.username,
			email: user.identity.email,
		};

		const PRIVATE_KEY = process.env.PRIVATE_KEY;
		user.authentication.sessionToken = jwt.sign(payload, PRIVATE_KEY, {
			algorithm: "RS256",
			expiresIn: "30d",
		});

		await user.save();
		const env = process.env.NODE_ENV as string;
		const port = process.env.PORT;
		let domain: string;

		if (env === "production") {
			const url = new URL(process.env.API_URL as string);
			domain = url.hostname;
		} else if (env === "development") {
			const url = new URL(`http://localhost:${port}`);
			domain = url.hostname;
		}

		const options = {
			domain: domain,
			path: "/",
			maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		};

		res.cookie("token", user.authentication.sessionToken, {
			...options,
			sameSite: "none",
		});

		const savedUser = {
			username: user.identity.username,
			email: user.identity.email,
			role: user.identity.role,
			sessionExpiredAt: moment()
				.add(options.maxAge, "milliseconds")
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
		};

		return response(
			200,
			"SUCCESS",
			savedUser,
			"User has successfully logged in",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed log in user: Internal server error",
			res
		);
	}
};

export const Register = async (req: Request, res: Response) => {
	try {
		const {
			first_name,
			last_name,
			username,
			email,
			password,
			phone,
			street,
			city,
			province,
			country,
			description,
		} = req.body;

		if (!first_name || !last_name || !username || !email || !password) {
			return errorResponse(
				400,
				"ERROR",
				"Missing necessary fields {first_name, last_name, username, email, password}",
				res
			);
		}

		const existingUserByEmail = await getUserByEmail(email);
		if (existingUserByEmail)
			return errorResponse(400, "ERROR", "User has registered!", res);

		const existingUserByUsername = await getUserByUsername(username);
		if (existingUserByUsername)
			return errorResponse(400, "ERROR", "User has registered!", res);

		const user = await createUser({
			identity: {
				first_name,
				last_name,
				username,
				email,
				phone,
				description,
			},
			authentication: {
				password,
			},
			address: {
				street,
				city,
				province,
				country,
			},
		});

		const filterResponse = {
			username: user.identity.username,
			email: user.identity.email,
			apiKey: user.authentication.key,
		};

		return response(200, "SUCCESS", filterResponse, "Register new user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			`Failed register user: Internal server error`,
			res
		);
	}
};
