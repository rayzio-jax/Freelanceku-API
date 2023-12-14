import express, { Express } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./connection";

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
	console.log(`⚡️[server]: Server running on port ${port}`);
});

connectDB();

app.use("/", router());
