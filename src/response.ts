import { Response } from "express";
export const response = (
	statusCode: number,
	status: string,
	data: {},
	message: string,
	res: Response,
	count?: number,
	size?: number,
	page?: number,
	sortBy?: string,
	sortOrder?: string
) => {
	const countPages = count ? Math.ceil(count / size) : null;
	let totalPages;

	countPages === null ? totalPages : (totalPages = countPages);
	res.status(statusCode).json({
		status,
		data,
		message,
		meta: {
			currentPage: page,
			totalPages,
			sortBy,
			sortOrder,
		},
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
