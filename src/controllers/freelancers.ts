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
		const sortByFirstname = req?.query?.sortByFirstname as string;
		const sortByEmail = req?.query?.sortByEmail as string;
		let freelancer: Object;

		if (
			typeof sortByEmail === "string" &&
			typeof sortByFirstname === "string"
		) {
			return errorResponse(
				400,
				"can't sort data: 2 value were given while only 1 value is acceptable",
				res
			);
		} else {
			if (sortByEmail === "asc") {
				freelancer = await getFreelancers({ email: 1 });
			} else if (sortByEmail === "desc") {
				freelancer = await getFreelancers({ email: -1 });
			} else if (sortByFirstname === "asc") {
				freelancer = await getFreelancers({ first_name: 1 });
			} else if (sortByFirstname === "desc") {
				freelancer = await getFreelancers({ first_name: -1 });
			} else {
				freelancer = await getFreelancers();
			}
		}

		return response(200, freelancer, "get all freelancer: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "get all freelancers: failed", res);
	}
};

export const registerFreelancer = async (req: Request, res: Response) => {
	try {
		const { first_name, last_name, email, password, phone, country } = req.body;
		if (
			!first_name ||
			!last_name ||
			!email ||
			!password ||
			!phone ||
			!country
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
			country,
		});

		response(200, freelancer, "register new user: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "bad request: invalid", res);
	}
};
