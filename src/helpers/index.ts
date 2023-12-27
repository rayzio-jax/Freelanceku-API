import "dotenv/config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Response } from "express";
import { errorResponse } from "../response";

const MAIL_USER: string = process.env.MAIL_USER;
const MAIL_PASS: string = process.env.MAIL_PASS;
const MAIL_HOST: string = process.env.MAIL_HOST;
const MAIL_PORT: number = parseInt(process.env.MAIL_PORT);
const MAIL_SENDER: string = process.env.MAIL_SENDER;

export const verifyToken = (
	token: string,
	publicKey: string,
	res: Response
) => {
	try {
		const decoded = jwt.verify(token, publicKey);
		return decoded;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			const expiredAt = new Date((error.expiredAt as any) * 1000);
			console.error(`JWT expired at: ${expiredAt}`);
			throw errorResponse(400, "ERROR", "Token Expired", res);
		} else {
			console.error("JWT verification error", error.message);
			throw errorResponse(400, "ERROR", "Failed To Verify Token", res);
		}
	}
};

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
	host: MAIL_HOST,
	port: MAIL_PORT || 465,
	secure: true,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
});

export const mailOptions = (toEmail: string): nodemailer.SendMailOptions => {
	return {
		from: MAIL_SENDER,
		sender: MAIL_SENDER,
		to: toEmail,
		subject: "Email Verification",
		text: "Click the following to verify your email.",
		html: "./email.html",
	};
};
