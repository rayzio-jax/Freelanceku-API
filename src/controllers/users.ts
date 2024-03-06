import { Request, Response } from "express";
import { get } from "lodash";
import { response, errorResponse } from "../response";
import {
	countUsers,
	deleteUserByUsername,
	getUserByUsername,
	getUsers,
	updateUserByUsername,
} from "../db/users";

export const getAUserByUsername = async (req: Request, res: Response) => {
	try {
		const username = req.query.username as string;
		const user = await getUserByUsername(username);

		if (!user) return errorResponse(404, "NOT FOUND", "User not found", res);

		return response(200, "SUCCESS", user, "Get user by username", res);
	} catch (error) {
		console.log(error);
		return errorResponse(
			400,
			"ERROR",
			"Failed get user: Internal server error",
			res
		);
	}
};

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
		let size = parseInt(req.query.size as string);
		let page = parseInt(req.query.page as string);
		const { sortBy, sortOrder } = req.query;
		let sorter: string;
		let sorting: {};
		let order: number;
		let orderText: string;
		let users: Object;

		sortOrder === "desc" ? (order = -1) : (order = 1);

		sortBy === "username"
			? (sorter = "username")
			: sortBy === "email"
			? (sorter = "email")
			: (sorter = "email");

		if (sorter === "username") {
			sorting = {
				"identity.username": order,
			};
		} else {
			sorting = {
				"identity.email": order,
			};
		}

		order === 1 ? (orderText = "asc") : (orderText = "desc");
		const filter = { __v: 0 };
		const count = await countUsers();

		if (!sortOrder || sortOrder === "") {
			users = await getUsers(size, page, filter, sorting);
		} else {
			users = await getUsers(size, page, filter, sorting);
		}

		return response(
			200,
			"SUCCESS",
			users,
			"Get all user",
			res,
			count,
			size,
			page,
			sortBy as string,
			orderText
		);
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
		let size = parseInt(req.query.size as string);
		let page = parseInt(req.query.page as string);
		const { sortBy, sortOrder } = req.query;
		let sorter: string;
		let sorting: {};
		let order: number;
		let orderText: string;
		let users: Object;

		sortOrder === "desc" ? (order = -1) : (order = 1);
		sortBy === "username"
			? (sorter = "username")
			: sortBy === "email"
			? (sorter = "email")
			: (sorter = "email");

		if (sorter === "username") {
			sorting = {
				"identity.username": order,
			};
		} else {
			sorting = {
				"identity.email": order,
			};
		}

		order === 1 ? (orderText = "asc") : (orderText = "desc");
		const filter = { _id: 0, "identity.username": 1, "identity.email": 1 };
		const count = await countUsers();

		if (!sortOrder || sortOrder === "") {
			users = await getUsers(size, page, filter, sorting);
		} else {
			users = await getUsers(size, page, filter, sorting);
		}

		return response(
			200,
			"SUCCESS",
			users,
			"Get all username and email",
			res,
			count,
			size,
			page,
			sortBy as string,
			orderText
		);
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
			new_phone,
			new_description,
			new_street,
			new_city,
			new_province,
			new_country,
		} = req.body;

		let { new_username } = req.body

		if(!new_username) new_username = username;

		const userIdentity = get(req, "user.identity.username");
		if (username !== userIdentity)
			return errorResponse(401, "UNAUTHORIZE", "Invalid user identity", res);

		const currentUser = await getUserByUsername(userIdentity);
		if (!currentUser)
			return errorResponse(404, "NOT FOUND", "User not exist", res);

		const existingUser = await getUserByUsername(new_username);
		if (existingUser && new_username !== username) {
			return errorResponse(
				400,
				"ERROR",
				"User with this username existed",
				res
			);
		}

		const user = await updateUserByUsername(userIdentity, {
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
			return errorResponse(
				400,
				"ERROR",
				"User not found, update data failed",
				res
			);
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
