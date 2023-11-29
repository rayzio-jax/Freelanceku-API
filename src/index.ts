import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose, { Promise } from "mongoose";

import router from "./router";

const port = process.env.PORT || 8080;

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

const db =
	"mongodb+srv://rayhan023:YZe0MD1oe0LnB5tf@api.8btaevm.mongodb.net/freelance-api?retryWrites=true&w=majority";

mongoose.Promise = Promise;
mongoose.connect(db);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
