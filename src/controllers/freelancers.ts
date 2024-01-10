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
		let freelancer: Object;

		if (
			(sortByFirstname !== "asc" && sortByFirstname !== "desc") ||
			(sortByEmail !== "asc" && sortByEmail !== "desc")
		) {
			return errorResponse(400, "INVALID", "Sort Not Valid", res);
		} else {
			if (sortByFirstname === "asc" && sortByEmail === "asc") {
				freelancer = await getFreelancers({ first_name: 1, email: 1 });
			} else if (sortByFirstname === "asc" && sortByEmail === "desc") {
				freelancer = await getFreelancers({ first_name: 1, email: -1 });
			} else if (sortByFirstname === "desc" && sortByEmail === "asc") {
				freelancer = await getFreelancers({ first_name: -1, email: 1 });
			} else if (sortByFirstname === "desc" && sortByEmail === "desc") {
				freelancer = await getFreelancers({ first_name: -1, email: -1 });
			} else {
				freelancer = await getFreelancers();
			}
		}

		return response(200, "SUCCESS", freelancer, "Get All Freelancer", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Get All Freelancer", res);
	}
};

export const registerFreelancer = async (req: Request, res: Response) => {
	try {
		const { first_name, last_name, email, phone, country } = req.body;
		if (!first_name || !last_name || !email || !phone || !country) {
			return errorResponse(400, "INVALID", "Missing Input Data", res);
		}

		const existingUser = await getFreelancerByEmail(email);
		if (existingUser) {
			return errorResponse(400, "INVALID", "User Existed", res);
		}

		const freelancer = await createFreelancer({
			first_name,
			last_name,
			email,
			phone,
			country,
		});

		response(200, "SUCCESS", freelancer, "Register New Freelancer", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed To Register New Freelancer",
			res
		);
	}
};
