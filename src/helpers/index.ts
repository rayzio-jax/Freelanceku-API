import "dotenv/config";
import crypto from "crypto";
import nodemailer from "nodemailer";

const TOKEN = process.env.SECRET_ACCESS_TOKEN;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
	return crypto
		.createHmac("sha256", [salt, password].join("/"))
		.update(TOKEN)
		.digest("hex");
};

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
	host: "smtp.elasticemail.com",
	port: 465,
	secure: true,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
});

export const mailOptions = (toEmail: string): nodemailer.SendMailOptions => {
	return {
		from: process.env.SENDER_VERIFY_EMAIL.toString(),
		to: toEmail,
		subject: "Email Verification",
		text: "Click the following to verify your email.",
	};
};
