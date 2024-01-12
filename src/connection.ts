import mongoose, { Promise } from "mongoose";
import "dotenv/config";

const db_url = process.env.MONGODB_URI;

export const connectDB = () => {
	try {
		mongoose.Promise = Promise;
		mongoose.connect(db_url);

		const db = mongoose.connection;
		db.on("error", (error: Error) => console.log(error));
		db.once("open", () => {
			console.log(
				`📄[database]: Connected to database with state ${db.readyState}`
			);
		});
	} catch (error) {
		console.log(`Failed to connect: ${error.message}`);
	}
};
