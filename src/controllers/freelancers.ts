import { Request, Response } from "express";
import { errorResponse, response } from "../response";
import {
	getFreelancerByEmail,
	getFreelancers,
	createFreelancer,
	getFreelancerByUsername,
	updateFreelancerByEmail,
} from "../db/freelancers";

export const updateFreelancer = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const {
			new_first_name,
			new_last_name,
			new_username,
			new_email,
			new_phone,
			new_address,
			new_province,
			new_country,
			new_description,
		} = req.body;

		const freelancer = await getFreelancerByUsername(username);
		if (!freelancer)
			return errorResponse(404, "NOT FOUND", "User not exist", res);

		const newFreelancer = updateFreelancerByEmail(freelancer.email.toString(), {
			first_name: new_first_name,
			last_name: new_last_name,
			username: new_username,
			email: new_email,
			phone: new_phone,
			address: new_address,
			province: new_province,
			country: new_country,
			description: new_description,
		});

		return response(
			200,
			"SUCCESS",
			newFreelancer,
			"Updating freelancer successful",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed updating freelancer", res);
	}
};

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
			local_address: {
				address,
				province,
				country,
			},
			description,
		});

		const filterResponse = {
			first_name: freelancer.first_name,
			last_name: freelancer.last_name,
			username: freelancer.username,
			email: freelancer.email,
			phone: freelancer.phone,
			address: freelancer.local_address.address,
			province: freelancer.local_address.province,
			country: freelancer.local_address.country,
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
