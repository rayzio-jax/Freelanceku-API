import { Response } from "express";
export const response = (
	statusCode: number,
	status: string,
	data: {},
	message: string,
	res: Response
) => {
	res.status(statusCode).json({
		status,
		message,
		data: data,
	});
};

export const errorResponse = (
	statusCode: number,
	status: string,
	message: {},
	res: Response
) => {
	res.status(statusCode).json({
		status,
		message,
	});
	res.end();
};
