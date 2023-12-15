import { Request, Response } from "express";

import { response, errorResponse } from "../response";
import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const sortByUsername = req.query.sortByUsername as string;
		let users: Object;

		if (sortByUsername === "asc") {
			users = await getUsers({});
		} else if (sortByUsername === "desc") {
			users = await getUsers({}, { username: -1 });
		} else {
			users = await getUsers({});
		}

		return response(200, "SUCCESS", users, "get all user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to get all user", res);
	}
};

export const getUsernameAndEmail = async (req: Request, res: Response) => {
	try {
		const sortByUsername = req.query.sortByUsername as string;
		let users: Object;

		if (sortByUsername === "asc") {
			users = await getUsers({ username: 1, email: 1 });
		} else if (sortByUsername === "desc") {
			users = await getUsers({ username: 1, email: 1 }, { username: -1 });
		} else {
			users = await getUsers({ username: 1, email: 1 });
		}

		return response(200, "SUCCESS", users, "get username and email", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to get username and email", res);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;

		const deletedUser = await deleteUserById(id);

		return response(200, "SUCCESS", deletedUser, "delete user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to delete user", res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;
		const { username } = req.body;

		if (!username) {
			return errorResponse(400, "BAD REQUEST", "username is missing", res);
		}

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return response(200, "SUCCESS", user, "update username", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "failed to update username", res);
	}
};
