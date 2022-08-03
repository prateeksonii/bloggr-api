import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundMiddleware } from "./middlewares";
import usersRouter from "./users/users.router";
import authRouter from "./auth/auth.router";
import blogRouter from "./blogs/blogs.router";

const app = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);

app.all("*", notFoundMiddleware);
app.use(errorHandler);

export default app;
