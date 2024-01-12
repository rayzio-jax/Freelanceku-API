import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../response";

type validationResultError = {
	[string: string]: string;
};

const Validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		let error: validationResultError = {};
		errors.array().map((err) => {
			if (err.type === "field") {
				error[err.path] = err.msg;
			}
		});
		return errorResponse(422, "INVALID", error, res);
	}
	next();
};
export default Validate;
