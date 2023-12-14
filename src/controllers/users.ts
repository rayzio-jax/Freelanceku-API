import { Request, Response } from "express";

import { response, errorResponse } from "../response";
import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await getUsers({}, { username: 1 });

		// return res.status(200).json(users);
		return response(200, users, "get all users: success", res);
	} catch (error) {
		console.log(error);
		// return res.sendStatus(400);
		return errorResponse(400, "get all users: failed", res);
	}
};

export const getUsernameAndEmail = async (req: Request, res: Response) => {
	try {
		const sortByUsername = req.query.sortByUsername as string;
		let users: Object;

		if (sortByUsername === "asc") {
			users = await getUsers({ username: 1, email: 1 }, { username: -1 });
		} else if (sortByUsername === "desc") {
			users = await getUsers({ username: 1, email: 1 }, { username: 1 });
		} else {
			users = await getUsers({ username: 1, email: 1 });
		}

		// return res.status(200).json(filteredQuery);
		return response(200, users, "get username & email: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "get username & email: failed", res);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;

		const deletedUser = await deleteUserById(id);

		// return res.json(deletedUser);
		return response(200, deletedUser, "delete user: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "delete user: failed", res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;
		const { username } = req.body;

		if (!username) {
			return errorResponse(400, "username not provided!", res);
		}

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return response(200, user, "update username: success", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "update username: failed", res);
	}
};
