import "dotenv/config";
import crypto from "crypto";
import nodemailer from "nodemailer";

const TOKEN = process.env.SECRET_ACCESS_TOKEN;

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
		user: "no-reply-test@fa-api.co",
		pass: "06525C7D5B00E1D4A18D3B9C760C4EC8FA18",
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
