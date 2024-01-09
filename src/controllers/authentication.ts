import "dotenv/config";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { response, errorResponse } from "../response";
import { createUser, getUserByEmail } from "../db/users";
import jwt from "jsonwebtoken";

export const Login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await getUserByEmail(email).select(
			"+authentication.password +authentication.key +authentication.salt"
		);

		if (!email || !password) {
			return errorResponse(400, "INVALID", "Invalid Username Or Email", res);
		}

		if (!user) {
			return errorResponse(403, "FORBIDDEN", "User Not Exist", res);
		}

		const expectedHash = await bcrypt.compare(
			password,
			user.authentication.password
		);

		if (!expectedHash) {
			return errorResponse(403, "FORBIDDEN", "Password Doesn't Match", res);
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

		const test = "ok";

		let options = {
			domain: domain,
			path: "/",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: true,
		};

		res.cookie("SessionTokenId", user.authentication.sessionToken, options);

		const savedUser = await getUserByEmail(email).select({
			_id: 0,
			username: 1,
			email: 1,
		});

		return response(
			200,
			"SUCCESS",
			savedUser,
			"User has Successfully Logged In",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed To Log In User: Internal Server Error",
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
				"Username, Password or Email is Missing",
				res
			);
		}

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return errorResponse(400, "INVALID", "User Existed", res);
		}

		await createUser({
			username,
			email,
			authentication: {
				password,
			},
			role,
		});

		const userResponse = getUserByEmail(email).select(
			"-_id username email created_at"
		);

		return response(
			200,
			"SUCCESS",
			(await userResponse).toJSON(),
			"Register New User",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			`Failed To Register User: Internal Server Error`,
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
