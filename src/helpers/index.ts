import crypto from "crypto";
import "dotenv/config";

const TOKEN = process.env.SECRET_ACCESS_TOKEN;

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
	return crypto
		.createHmac("sha256", [salt, password].join("/"))
		.update(TOKEN)
		.digest("hex");
};
