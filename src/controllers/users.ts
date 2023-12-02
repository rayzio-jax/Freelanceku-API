import { Request, Response } from "express";

import { response, error } from "../response";
import { deleteUserById, getUserById, getUsers } from "../db/users";

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

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;

		const deletedUser = await deleteUserById(id);

		// return res.json(deletedUser);
		return response(200, deletedUser, "delete user: success", res);
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;
		const { username } = req.body;

		if (!username) {
			return error(400, "Username not provided!", res);
		}

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return response(200, user, "Update username success", res);
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
