import { Request, Response } from "express";
import { get } from "lodash";
import { response, errorResponse } from "../response";
import {
	deleteUserByUsername,
	getUserByUsername,
	getUsers,
	updateUserByUsername,
} from "../db/users";

export const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const userIdentity = get(req, "user.identity.username");

		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const currentUser = await getUserByUsername(userIdentity);

		if (!currentUser)
			return errorResponse(404, "NOT FOUND", "User not found", res);

		return response(
			200,
			"SUCCESS",
			currentUser,
			"Get current logged in user",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed get current user: Internal server error",
			res
		);
	}
};

export const getAllUser = async (req: Request, res: Response) => {
	try {
		const sortByEmail = (req.query?.sortByEmail ?? "asc") as string;
		let users: Object;

		if (!sortByEmail || sortByEmail === "") {
			const filter = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
			users = await getUsers(filter);
		} else {
			let emailSort;

			sortByEmail === "asc" ? (emailSort = 1) : (emailSort = -1);

			const filter = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
			const sorter = {
				"identity.email": emailSort,
			};

			users = await getUsers(filter, sorter);
		}
		return response(200, "SUCCESS", users, "Get all user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed get all user: Internal server error",
			res
		);
	}
};

export const getAllUsernameAndEmail = async (req: Request, res: Response) => {
	try {
		const sortByEmail = (req.query?.sortByEmail ?? "asc") as string;
		let users: Object;

		if (!sortByEmail || sortByEmail === "") {
			const filter = { _id: 0, "identity.username": 1, "identity.email": 1 };
			users = await getUsers(filter);
		} else {
			let emailSort;
			sortByEmail === "asc" ? (emailSort = 1) : (emailSort = -1);

			const filter = { _id: 0, "identity.username": 1, "identity.email": 1 };
			const sorter = { "identity.email": emailSort };

			users = await getUsers(filter, sorter);
		}

		return response(200, "SUCCESS", users, "Get all username and email", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed get username and email: Internal server error",
			res
		);
	}
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const userIdentity = get(req, "user.identity.username");

		if (!userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "User not authorized", res);

		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const currentUser = await getUserByUsername(userIdentity);

		const deletedUser = await deleteUserByUsername(
			currentUser.identity.username
		);

		return response(200, "SUCCESS", deletedUser, "Delete user success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed deleting user: Internal server error",
			res
		);
	}
};

export const updateCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const {
			new_first_name,
			new_last_name,
			new_username,
			new_phone,
			new_street,
			new_city,
			new_province,
			new_country,
			new_description,
		} = req.body;

		if (
			!new_first_name ||
			!new_last_name ||
			!new_username ||
			!new_phone ||
			!new_street ||
			!new_city ||
			!new_province ||
			!new_country ||
			!new_description
		) {
			return errorResponse(400, "ERROR", "Missing necessary fields", res);
		}

		const userIdentity = get(req, "user.identity.username");

		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const currentUser = await getUserByUsername(userIdentity);

		const user = await updateUserByUsername(currentUser.identity.username, {
			identity: {
				first_name: new_first_name,
				last_name: new_last_name,
				username: new_username,
				phone: new_phone,
				description: new_description,
			},
			address: {
				street: new_street,
				city: new_city,
				province: new_province,
				country: new_country,
			},
		});

		if (!user) {
			return errorResponse(400, "ERROR", "User not found", res);
		}

		return response(200, "SUCCESS", user, "Update username successful", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed updating data: Internal server error",
			res
		);
	}
};
