import { Request, Response } from "express";

import { response, errorResponse } from "../response";
import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUser = async (req: Request, res: Response) => {
	try {
		const sortByUsername = req.query.sortByUsername as string;
		const sortByEmail = req.query.sortByEmail as string;
		let users: Object;

		if (
			(sortByUsername !== "asc" && sortByUsername !== "desc") ||
			(sortByEmail !== "asc" && sortByEmail !== "desc")
		) {
			return errorResponse(400, "INVALID", "Get All User: Sort Not Valid", res);
		} else {
			if (sortByUsername === "asc" && sortByEmail === "asc") {
				users = await getUsers(
					{ _id: 0, __v: 0, created_at: 0 },
					{ username: 1, email: 1 }
				);
			} else if (sortByUsername === "asc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, __v: 0, created_at: 0 },
					{ username: 1, email: -1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "asc") {
				users = await getUsers(
					{ _id: 0, __v: 0, created_at: 0 },
					{ username: -1, email: 1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, __v: 0, created_at: 0 },
					{ username: -1, email: -1 }
				);
			} else {
				users = await getUsers({ _id: 0, __v: 0, created_at: 0 }, {});
			}
		}
		return response(200, "SUCCESS", users, "Get All User", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Get All User", res);
	}
};

export const getUsernameAndEmail = async (req: Request, res: Response) => {
	try {
		const sortByUsername = req.query.sortByUsername as string;
		const sortByEmail = req.query.sortByEmail as string;
		let users: Object;

		if (
			(sortByUsername !== "asc" && sortByUsername !== "desc") ||
			(sortByEmail !== "asc" && sortByEmail !== "desc")
		) {
			return errorResponse(
				400,
				"INVALID",
				"Get All User (Unauth): Sort Not Valid",
				res
			);
		} else {
			if (sortByUsername === "asc" && sortByEmail === "asc") {
				users = await getUsers(
					{ _id: 0, __v: 0, username: 1, email: 1 },
					{ username: 1, email: 1 }
				);
			} else if (sortByUsername === "asc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, __v: 0, username: 1, email: 1 },
					{ username: 1, email: -1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "asc") {
				users = await getUsers(
					{ _id: 0, __v: 0, username: 1, email: 1 },
					{ username: -1, email: 1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, __v: 0, username: 1, email: 1 },
					{ username: -1, email: -1 }
				);
			} else {
				users = await getUsers({ _id: 0, __v: 0, username: 1, email: 1 }, {});
			}
		}

		return response(200, "SUCCESS", users, "Get All Username And Email", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Get Username And Email", res);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;

		const deletedUser = await deleteUserById(id);

		return response(200, "SUCCESS", deletedUser, "Delete User", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Delete User", res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.query.id as string;
		const { username } = req.body;

		if (!username) {
			return errorResponse(400, "BAD REQUEST", "Username Is Missing", res);
		}

		const user = await getUserById(id);
		user.username = username;
		await user.save();

		return response(200, "SUCCESS", user, "Update Username Successful", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Update Username", res);
	}
};
