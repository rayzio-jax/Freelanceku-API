import { Response } from "express";
export const response = (
	statusCode: number,
	data: {},
	message: string,
	res: Response
) => {
	res.status(statusCode).json({
		metadata: {
			prev: "",
			next: "",
			current: "",
		},
		message,
		data: data,
	});
};
