import "dotenv/config";
import crypto from "crypto";
import nodemailer from "nodemailer";

const TOKEN = process.env.SECRET_ACCESS_TOKEN;
const MAIL_USER: string = process.env.MAIL_USER;
const MAIL_PASS: string = process.env.MAIL_PASS;
const MAIL_HOST: string = process.env.MAIL_HOST;
const MAIL_PORT: number = parseInt(process.env.MAIL_PORT);
const MAIL_SENDER: string = process.env.MAIL_SENDER;

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
	return crypto
		.createHmac("sha256", [salt, password].join("/"))
		.update(TOKEN)
		.digest("hex");
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
		to: toEmail,
		subject: "Email Verification",
		text: "Click the following to verify your email.",
	};
};
