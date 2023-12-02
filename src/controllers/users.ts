import { Request, Response } from "express";

import { response } from "../response";
import { deleteUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();

		// return res.status(200).json(users);
		return response(200, users, "get all users: success", res);
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const getUsernameAndEmail = async (req: Request, res: Response) => {
	try {
		const users = await getUsers();
		const filteredQuery = users.map(({ username, email }) => ({
			username,
			email,
		}));

		// return res.status(200).json(filteredQuery);
		return response(200, filteredQuery, "get username & email: success", res);
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
