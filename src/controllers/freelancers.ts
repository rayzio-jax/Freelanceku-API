import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import {
	getFreelancerByEmail,
	getFreelancers,
	createFreelancer,
} from "../db/freelancers";

export const getAllFreelancer = async (req: Request, res: Response) => {
	try {
		const sortByFirstname = req?.query?.sortByFirstname as string;
		const sortByEmail = req?.query?.sortByEmail as string;
		let freelancers: Object;

		if (
			(sortByFirstname !== "asc" && sortByFirstname !== "desc") ||
			(sortByEmail !== "asc" && sortByEmail !== "desc")
		) {
			freelancers = await getFreelancers({ _id: 0, __v: 0 }, {});
		} else {
			let first_name;
			let email;
			sortByFirstname === "asc" ? (first_name = 1) : (first_name = -1);
			sortByEmail === "asc" ? (email = 1) : (email = -1);

			freelancers = await getFreelancers(
				{ _id: 0, __v: 0 },
				{ first_name, email }
			);
		}

		return response(200, "SUCCESS", freelancers, "Get all freelancer", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed get all freelancer", res);
	}
};

export const registerFreelancer = async (req: Request, res: Response) => {
	try {
		const {
			first_name,
			last_name,
			username,
			email,
			phone,
			address,
			province,
			country,
			description,
		} = req.body;
		if (
			!first_name ||
			!last_name ||
			!username ||
			!email ||
			!phone ||
			!address ||
			!province ||
			!country
		) {
			return errorResponse(400, "INVALID", "Some input data is missing", res);
		}

		if (!description)
			return errorResponse(400, "INVALID", "Freelancer bio is required", res);

		const existingUser = await getFreelancerByEmail(email);
		if (existingUser) {
			return errorResponse(400, "INVALID", "User existed", res);
		}

		const freelancer = await createFreelancer({
			first_name,
			last_name,
			username,
			email,
			phone,
			address,
			province,
			country,
			description,
		});

		const filterResponse = {
			first_name: freelancer.first_name,
			last_name: freelancer.last_name,
			username: freelancer.username,
			email: freelancer.email,
			phone: freelancer.phone,
			address: freelancer.address,
			province: freelancer.province,
			country: freelancer.country,
			description: freelancer.description,
		};

		return response(
			200,
			"SUCCESS",
			filterResponse,
			"Register new freelancer",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed register new freelancer", res);
	}
};
