import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose, { Promise } from "mongoose";

import router from "./router";

const port = process.env.PORT || 8080;
const db_url = process.env.MONGO_URL;

const app: Express = express();

app.use(
	cors({
		credentials: true,
	})
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(port, () => {
	console.log(`⚡️[server]: Server running on http://localhost:${port}/`);
});

mongoose.Promise = Promise;
mongoose.connect(db_url);

const db = mongoose.connection;
db.on("error", (error: Error) => console.log(error));
db.once("open", () => {
	console.log(
		`📄[database]: Connected to database ${db.name} state ${db.readyState}`
	);
});

app.use("/", router());
