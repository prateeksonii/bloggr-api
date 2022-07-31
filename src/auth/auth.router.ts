import { Router } from "express";
import { getAuthenticatedUser, signIn, signOut } from "./auth.controller";
import { isAuthenticated } from "./auth.middleware";

const authRouter = Router();

authRouter.post("/signin", signIn);
authRouter.get("/signout", isAuthenticated, signOut);
authRouter.get("/me", isAuthenticated, getAuthenticatedUser);

export default authRouter;
