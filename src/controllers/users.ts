import { Request, Response } from "express";
import { get } from "lodash";
import { response, errorResponse } from "../response";
import {
	deleteUserByUsername,
	getUserById,
	getUsers,
	updateUserByEmail,
} from "../db/users";

export const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const userId = get(req, "identity._id");
		if (!userId)
			return errorResponse(404, "NOT FOUND", "User id not exist", res);

		const currentUser = await getUserById(userId);

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
		return errorResponse(400, "ERROR", "Failed to get all user", res);
	}
};

export const getAllUser = async (req: Request, res: Response) => {
	try {
		const sortByUsername = (req.query?.sortByUsername ?? "asc") as string;
		const sortByEmail = (req.query?.sortByEmail ?? "asc") as string;
		let users: Object;

		if (
			(sortByUsername !== "asc" && sortByUsername !== "desc") ||
			(sortByEmail !== "asc" && sortByEmail !== "desc")
		) {
			users = await getUsers(
				{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
				{}
			);
		} else {
			let username;
			let email;
			sortByUsername === "asc" ? (username = 1) : (username = -1);
			sortByEmail === "asc" ? (email = 1) : (email = -1);

			users = await getUsers(
				{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
				{ username, email }
			);
		}
		return response(200, "SUCCESS", users, "Get all user", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed to get all user", res);
	}
};

export const getAllUsernameAndEmail = async (req: Request, res: Response) => {
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
					{ _id: 0, username: 1, email: 1 },
					{ username: 1, email: 1 }
				);
			} else if (sortByUsername === "asc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, username: 1, email: 1 },
					{ username: 1, email: -1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "asc") {
				users = await getUsers(
					{ _id: 0, username: 1, email: 1 },
					{ username: -1, email: 1 }
				);
			} else if (sortByUsername === "desc" && sortByEmail === "desc") {
				users = await getUsers(
					{ _id: 0, username: 1, email: 1 },
					{ username: -1, email: -1 }
				);
			} else {
				users = await getUsers({ _id: 0, username: 1, email: 1 }, {});
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
		const { username } = req.body;

		const deletedUser = await deleteUserByUsername(username);

		const filterResponse = {
			username: deletedUser.username,
			email: deletedUser.email,
			role: deletedUser.role,
		};

		return response(
			200,
			"SUCCESS",
			filterResponse,
			`Delete User Success: ${deletedUser.username}`,
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Delete User", res);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { email, new_username } = req.body;
		if (!new_username) {
			return errorResponse(400, "BAD REQUEST", "New Username Is Missing", res);
		}
		const user = await updateUserByEmail(email, { username: new_username });
		if (!user) {
			return errorResponse(400, "ERROR", "Failed To Update Username", res);
		}

		const filterResponse = {
			username: user.username,
			email: user.email,
		};

		return response(
			200,
			"SUCCESS",
			filterResponse,
			"Update Username Successful",
			res
		);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Update Username", res);
	}
};
