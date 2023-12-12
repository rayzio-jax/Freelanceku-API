import { Response } from "express";
export const response = (
	statusCode: number,
	data: {},
	message: string,
	res: Response
) => {
	res.status(statusCode).json({
		message,
		data: data,
		metadata: {
			prev: "",
			next: "",
			current: "",
		},
	});
};

export const error = (statusCode: number, message: string, res: Response) => {
	res.status(statusCode).json({
		message,
	});
};
