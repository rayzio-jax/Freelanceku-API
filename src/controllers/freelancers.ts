import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import {
	getFreelancerByEmail,
	getFreelancers,
	createFreelancer,
} from "../db/freelancers";
import { random, authentication } from "../helpers";

export const getAllFreelancer = async (req: Request, res: Response) => {
	try {
		const freelancer = await getFreelancers();

		return response(200, freelancer, "get all freelancer: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "get all freelancers: failed", res);
	}
};

export const registerFreelancer = async (req: Request, res: Response) => {
	try {
		const { first_name, last_name, email, password, phone, address } = req.body;
		if (
			!first_name ||
			!last_name ||
			!email ||
			!password ||
			!phone ||
			!address
		) {
			return errorResponse(400, "bad request: invalid", res);
		}

		const existingUser = await getFreelancerByEmail(email);
		if (existingUser) {
			return errorResponse(400, "bad request: invalid", res);
		}

		const salt = random();
		const freelancer = await createFreelancer({
			first_name,
			last_name,
			email,
			password: authentication(salt, password),
			phone,
			address,
		});

		// return res.status(200).json(user).end();
		response(200, freelancer, "register new user: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "bad request: invalid", res);
	}
};
