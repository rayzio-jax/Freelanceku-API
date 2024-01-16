import "dotenv/config";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { response, errorResponse } from "../response";
import { createUser, getUserByEmail } from "../db/users";
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

		const newLoggedOutUser = new Blacklist({
			token: accessToken,
		});
		await newLoggedOutUser.save();
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
			return errorResponse(400, "INVALID", "Invalid email or password", res);
		}

		const user = await getUserByEmail(email).select(
			"+authentication.password +authentication.key +authentication.salt"
		);

		if (!user) {
			return errorResponse(403, "FORBIDDEN", "User not exist", res);
		}

		const expectedHash = await bcrypt.compare(
			password,
			user.authentication.password
		);

		if (!expectedHash) {
			return errorResponse(403, "FORBIDDEN", "Invalid password", res);
		}

		const payload = {
			_id: user._id,
		};

		const PRIVATE_KEY = process.env.PRIVATE_KEY;
		user.authentication.sessionToken = jwt.sign(payload, PRIVATE_KEY, {
			algorithm: "RS256",
			expiresIn: "7d",
		});

		await user.save();
		const env = process.env.NODE_ENV as string;
		const port = process.env.PORT;
		let domain: string;

		if (env === "production") {
			const url = new URL("https://freelance-api-production.up.railway.app");
			domain = url.hostname;
		} else if (env === "development") {
			const url = new URL(`http://localhost:${port}`);
			domain = url.hostname;
		}

		let options = {
			domain: domain,
			path: "/",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		};

		res.cookie("SessionTokenID", user.authentication.sessionToken, options);

		const savedUser = {
			username: user.username,
			email: user.email,
			sessionExpiredAt: moment()
				.add(options.maxAge, "milliseconds")
				.format("MMMM Do YYYY, h:mm:ss a"),
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
		const { username, email, password, role } = req.body;
		if (!username || !email || !password) {
			return errorResponse(
				400,
				"INVALID",
				"Username, password or email is missing",
				res
			);
		}

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return errorResponse(400, "INVALID", "User existed", res);
		}

		const user = await createUser({
			username,
			email,
			authentication: {
				password,
			},
			role,
		});

		const filterResponse = {
			username: user.username,
			email: user.email,
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

// export const Verify = async (req: Request, res: Response) => {
// 	try {
// 		const user = getUserByEmail;
// 	} catch (error) {
// 		console.log(error);
// 		return errorResponse(400, "ERROR", "Failed To Verify User", res);
// 	}
// };
