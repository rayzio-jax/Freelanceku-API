import { Request, Response } from "express";
import { get } from "lodash";
import { response, errorResponse } from "../response";
import {
	deleteUserById,
	getUserById,
	getUsers,
	updateUserById,
} from "../db/users";

export const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const userIdentity = get(req, "identity.username");
		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const identityID = get(req, "identity._id");
		const currentUser = await getUserById(identityID);

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
			users = await getUsers({ _id: 0, username: 1, email: 1 }, {});
		} else {
			let username;
			let email;
			sortByUsername === "asc" ? (username = 1) : (username = -1);
			sortByEmail === "asc" ? (email = 1) : (email = -1);

			users = await getUsers(
				{ _id: 0, username: 1, email: 1 },
				{ username, email }
			);
		}

		return response(200, "SUCCESS", users, "Get All Username And Email", res);
	} catch (error) {
		console.log(error);
		return errorResponse(400, "ERROR", "Failed To Get Username And Email", res);
	}
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const userIdentity = get(req, "identity.username");
		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const identityID = get(req, "identity._id");
		const currentUser = await getUserById(identityID);

		const deletedUser = await deleteUserById(currentUser._id.toString());

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

export const updateCurrentUser = async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const { new_username } = req.body;
		const userIdentity = get(req, "identity.username");

		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		if (!new_username) {
			return errorResponse(400, "BAD REQUEST", "New Username Is Missing", res);
		}

		const identityID = get(req, "identity._id");
		const currentUser = await getUserById(identityID);

		const user = await updateUserById(currentUser._id.toString(), {
			username: new_username,
		});
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
